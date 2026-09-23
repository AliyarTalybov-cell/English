// «Подобрать слова с ИИ» in «Мои слова»: 20 of the most useful A1–A2 words of a topic go straight into
// the student's dictionary. Words already in the dictionary or given before are never offered again;
// at most 60 words from the AI stay in a dictionary at once. One call takes one question from the AI allowance.
// Models come through OpenRouter, like the `ask` helper; the key is the OPENROUTER_API_KEY secret.
import { createClient } from "npm:@supabase/supabase-js@2";

const MODELS = ["google/gemini-3.1-flash-lite", "nvidia/nemotron-3-super-120b-a12b:free", "google/gemma-4-31b-it:free"];
const BATCH = 20;

// The same list as in the browser (src/words.js): id → what the model is asked about.
const TOPICS: Record<string, string> = {
  home: "дом, квартира, мебель, домашние дела",
  food: "еда, напитки, кафе, готовка",
  people: "люди, семья, друзья, внешность и характер",
  work: "работа, профессии, учёба",
  city: "город, места в городе, транспорт, дорога",
  travel: "путешествия, отель, аэропорт, отдых",
  shopping: "покупки, магазины, одежда, деньги",
  time: "время, дни недели, месяцы, погода",
  health: "тело, здоровье, самочувствие, врач",
  free: "свободное время, хобби, спорт, развлечения",
  verbs: "самые нужные глаголы повседневной речи",
  describe: "самые нужные прилагательные: описания людей, вещей, мест",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const prompt = (topic: string, exclude: string[], count: number) => `Подбери ${count} английских слов для русскоязычного ученика уровня A1–A2. Тема: ${topic}.

Бери самые частые и полезные слова этой темы, которые правда нужны в повседневной речи, — сначала самые важные.
- Слово пиши строчными буквами. Существительные без артикля, глаголы в начальной форме без «to». Можно короткое устойчивое выражение до трёх слов (например, «get up»), если оно очень частое.
- Перевод на русский короткий: одно-два значения через запятую, именно в смысле этой темы.
- Не повторяй слова из списка ниже и их формы — ученик их уже знает или уже получал.
${exclude.length ? `\nУже есть: ${exclude.join(", ")}\n` : ""}
Ответь только JSON без пояснений: {"words":[{"word":"kitchen","ru":"кухня"}]}`;

// The model's answer as a list of { word, ru }, whatever wrapping it came in.
const parseWords = (text: string) => {
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end < start) return [];
  try {
    const data = JSON.parse(text.slice(start, end + 1));
    const list = Array.isArray(data) ? data : data.words;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  const auth = req.headers.get("Authorization") || "";
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false },
  });
  const { data: userData } = await sb.auth.getUser(auth.replace(/^Bearer\s+/i, ""));
  const user = userData?.user;
  if (!user) return json({ error: "auth" }, 401);

  let body: { topic?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  const topic = TOPICS[body.topic || ""];
  if (!topic) return json({ error: "bad_request" }, 400);

  const { data: state, error: stateError } = await sb.rpc("ai_words_state");
  if (stateError) return json({ error: "server" }, 500);
  if (state.ai_total >= state.limit) return json({ error: "full", ai_total: state.ai_total }, 409);

  const { data: left, error: takeError } = await sb.rpc("ai_take_question");
  if (takeError) return json({ error: "server" }, 500);
  if (left < 0) return json({ error: "limit", left: 0 }, 429);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const refund = () => admin.rpc("ai_refund_question", { p_user: user.id }).then(() => {}, () => {});

  const key = Deno.env.get("OPENROUTER_API_KEY");
  const deadline = Date.now() + 90_000;
  const complete = async (content: string) => {
    let last = "";
    for (const model of MODELS) {
      const time = Math.min(25_000, deadline - Date.now());
      if (time < 3_000) break;
      try {
        const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`, "Content-Type": "application/json",
            "HTTP-Referer": "https://english-platform-orcin.vercel.app", "X-Title": "English",
          },
          body: JSON.stringify({ model, messages: [{ role: "user", content }], max_tokens: 1500, temperature: 0.4 }),
          signal: AbortSignal.timeout(time),
        });
        const data = await r.json().catch(() => ({}));
        const text = data.choices?.[0]?.message?.content;
        if (r.ok && text) {
          const words = parseWords(String(text));
          if (words.length) return words;
          last = `${model} unreadable answer`;
          continue;
        }
        last = `${model} ${r.status} ${JSON.stringify(data.error || data).slice(0, 160)}`;
        if (r.ok || r.status === 402 || r.status === 408 || r.status === 429 || r.status >= 500) continue;
        break;
      } catch (e) {
        last = `${model} ${String((e as Error).message || e).slice(0, 120)}`;
      }
    }
    throw new Error(last || "no time left");
  };

  try {
    // Everything the student has or was given, lower-cased, so repeats are dropped even if the model ignores the list.
    const seen = new Set<string>((state.exclude || []).map((w: string) => w.toLowerCase()));
    const fresh: { word: string; ru: string }[] = [];
    const room = Math.min(BATCH, state.limit - state.ai_total);
    // A second, smaller request fills the gap when the model repeated too many known words.
    for (let round = 0; round < 2 && fresh.length < room; round++) {
      const got = await complete(prompt(topic, [...seen], round ? room - fresh.length + 5 : room + 6));
      for (const it of got) {
        const word = String(it?.word || "").trim().toLowerCase().replace(/^to\s+/, "");
        const ru = String(it?.ru || "").trim();
        if (!word || !ru || word.length > 60 || ru.length > 200 || !/^[a-z][a-z' -]*$/.test(word) || seen.has(word)) continue;
        seen.add(word);
        fresh.push({ word, ru });
        if (fresh.length >= room) break;
      }
    }
    if (!fresh.length) throw new Error("no new words");
    const { data: added, error } = await sb.rpc("add_ai_words", { p_items: fresh, p_topic: body.topic });
    if (error) throw error;
    if (!added.added.length) { await refund(); return json({ error: "full", ai_total: added.ai_total }, 409); }
    return json({ added: added.added, ai_total: added.ai_total, limit: state.limit, left });
  } catch (e) {
    console.error("words failed", e);
    await refund();
    return json({ error: "unavailable" }, 503);
  }
});

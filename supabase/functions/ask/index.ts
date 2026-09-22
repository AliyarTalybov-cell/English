// «Спросить»: the students' AI helper. A student asks about English or about their own progress;
// the model answers in Russian and reads the student's data through read-only tools.
// The database is queried with the student's own session, so row-level security keeps it to their data.
// Models come through OpenRouter; its key is a Supabase secret (OPENROUTER_API_KEY) and never reaches the browser.
import { createClient } from "npm:@supabase/supabase-js@2";

// Tried in this order: a cheap paid model first; when it is out of credit (402), rate-limited (429)
// or unavailable (5xx, timeout), the free ones answer.
const MODELS = ["google/gemini-3.1-flash-lite", "nvidia/nemotron-3-super-120b-a12b:free", "google/gemma-4-31b-it:free"];
const MAX_TURNS = 12;        // earlier messages of the conversation sent back for context
const MAX_TEXT = 2000;       // characters per message
const MAX_TOOL_ROUNDS = 6;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SYSTEM = `Ты — помощник по английскому языку на учебной платформе English. С тобой говорит ученик уровня A1–A2, он русскоязычный.

Как отвечать:
- По-русски, коротко и по делу: обычно 2–6 предложений. Английские примеры — короткие, на уровне A1–A2.
- Обращайся к ученику на «вы», как весь сайт.
- Объясняй просто, через сравнение с русским, как хороший учитель. Без длинных вступлений и без списков из десяти пунктов.
- Можно выделить главное через **жирный** и дать короткий список, если он правда помогает. Заголовков и таблиц не нужно.
- Если ученик спрашивает о своём прогрессе, ошибках, темах или словах — сначала посмотри данные инструментами и отвечай по ним. Не выдумывай данные.
- Если ученик прислал задание и свой ответ — объясни, в чём ошибка и какое правило работает. Готовый правильный ответ называй, только если он прямо попросит; иначе подведи к нему.
- Если вопрос не про английский и не про учёбу на платформе — мягко верни разговор к английскому.`;

const TOOL_LIST = [
  {
    name: "get_progress",
    description: "Прогресс ученика по всем урокам: для каждого урока slug, название, сколько заданий решено из скольких, сколько с первой попытки, сколько ошибок ждут повторения, на какой теме ученик остановился. Используй, чтобы понять, что ученик уже прошёл, и чтобы узнать slug урока для других инструментов.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_mistakes",
    description: "Задания, в которых ученик ошибся и ещё не исправил ошибку: тема, текст задания, правильный ответ и пояснение. Без lesson_slug — по всем урокам (не больше 30 заданий).",
    input_schema: {
      type: "object",
      properties: { lesson_slug: { type: "string", description: "slug урока из get_progress, если нужны ошибки одного урока" } },
      additionalProperties: false,
    },
  },
  {
    name: "get_topic",
    description: "Объяснение темы урока, как оно написано на платформе. Без topic возвращает список тем урока (id, короткое название, заголовок); с topic — текст объяснения этой темы.",
    input_schema: {
      type: "object",
      properties: {
        lesson_slug: { type: "string", description: "slug урока из get_progress" },
        topic: { type: "string", description: "id темы или часть её названия" },
      },
      required: ["lesson_slug"],
      additionalProperties: false,
    },
  },
  {
    name: "get_my_words",
    description: "Слова, которые ученик сохранил в «Мои слова»: слово, перевод, выучено ли, когда повторять.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
];

// Tools in the OpenAI-style format OpenRouter takes.
const TOOLS = TOOL_LIST.map(t => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.input_schema } }));

// ---------- lesson content helpers ----------
type Item = { t: string; q?: string; a: string | string[]; o?: string[]; w?: number; c?: string; ex?: string };
type Section = { id: string; nav: string; title: string; theory?: string; groups: { title: string; items: Item[] }[] };

const answerText = (it: Item) => {
  if (it.t === "choice") return String(it.a);
  if (it.t === "fix") return (it.q || "").split(" ").map((w, i) => i === it.w ? (it.c || "") + ((w.match(/[.?!]$/) || [""])[0]) : w).join(" ");
  return Array.isArray(it.a) ? it.a[0] : String(it.a);
};
const plain = (html: string) => html
  .replace(/<(br|\/p|\/li|\/h\d|\/tr|\/div)>/gi, "\n").replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();

// ---------- the function ----------
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

  let body: { messages?: { role: string; text: string }[]; context?: Record<string, string>; debug?: boolean };
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  // Model, status and time of every call to the model: always in the log, and in the answer when debugging.
  const attempts: string[] = [];
  const reply = (b: Record<string, unknown>, status = 200) => {
    if (attempts.length) console.log("ask attempts", status, attempts.join(" | "));
    return json(body.debug ? { ...b, attempts } : b, status);
  };
  const history = (body.messages || [])
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role as "user" | "assistant", content: m.text.slice(0, MAX_TEXT) }));
  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length || history[history.length - 1].role !== "user") return reply({ error: "bad_request" }, 400);

  // A task the student asked about from the lesson: its text and their answer go with the question.
  const ctx = body.context;
  if (ctx && typeof ctx === "object") {
    const lines = [
      ctx.lesson && `Урок: ${ctx.lesson}`, ctx.topic && `Тема: ${ctx.topic}`,
      ctx.task && `Задание: ${ctx.task}`, ctx.answer && `Ответ ученика: ${ctx.answer}`,
      ctx.feedback && `Что сайт сказал об ошибке: ${ctx.feedback}`,
    ].filter(Boolean).map(s => String(s).slice(0, 500));
    if (lines.length) history[history.length - 1].content = `${lines.join("\n")}\n\n${history[history.length - 1].content}`;
  }

  const { data: left, error: takeError } = await sb.rpc("ai_take_question");
  if (takeError) return reply({ error: "server" }, 500);
  if (left < 0) return reply({ error: "limit", left: 0 }, 429);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const refund = () => admin.rpc("ai_refund_question", { p_user: user.id }).then(() => {}, () => {});

  // ---------- tools: read-only, with the student's session ----------
  const lessonCache: Record<string, { content: { sections: Section[] }; progress: Record<string, { status: string; fixed: boolean }> } | null> = {};
  const lesson = async (slug: string) => {
    if (!(slug in lessonCache)) {
      const { data } = await sb.rpc("get_lesson", { p_slug: slug });
      lessonCache[slug] = data || null;
    }
    return lessonCache[slug];
  };
  const run = async (name: string, input: Record<string, string>) => {
    if (name === "get_progress") {
      const { data, error } = await sb.rpc("list_lessons");
      if (error) throw error;
      return (data || []).map((l: Record<string, unknown>) => ({
        slug: l.slug, title: l.title, total: l.total, done: l.done, first_try_ok: l.ok, mistakes_to_repeat: l.mistakes, current_topic: l.resume_title,
      }));
    }
    if (name === "get_mistakes") {
      const { data: lessons } = await sb.rpc("list_lessons");
      const slugs = input.lesson_slug ? [input.lesson_slug]
        : (lessons || []).filter((l: { mistakes: number }) => l.mistakes > 0).map((l: { slug: string }) => l.slug);
      const out = [];
      for (const slug of slugs) {
        const l = await lesson(slug);
        if (!l) continue;
        for (const s of l.content.sections) s.groups.forEach((g, gi) => g.items.forEach((it, ii) => {
          const p = l.progress[`${s.id}-${gi}-${ii}`];
          if (p && p.status !== "ok" && !p.fixed && out.length < 30)
            out.push({ lesson: slug, topic: s.nav, task: it.q || "(расставить слова по порядку)", correct: answerText(it), why: it.ex || "" });
        }));
      }
      return out.length ? out : "Неисправленных ошибок нет.";
    }
    if (name === "get_topic") {
      const l = await lesson(input.lesson_slug);
      if (!l) return "Такого урока нет. Узнай slug через get_progress.";
      if (!input.topic) return l.content.sections.map(s => ({ id: s.id, nav: s.nav, title: s.title }));
      const q = input.topic.toLowerCase();
      const s = l.content.sections.find(x => x.id === input.topic) || l.content.sections.find(x => `${x.nav} ${x.title}`.toLowerCase().includes(q));
      if (!s) return l.content.sections.map(x => ({ id: x.id, nav: x.nav, title: x.title }));
      return { id: s.id, title: s.title, explanation: plain(s.theory || "").slice(0, 5000) };
    }
    if (name === "get_my_words") {
      const { data, error } = await sb.rpc("list_my_words", { p_due_only: false, p_limit: 100, p_offset: 0 });
      if (error) throw error;
      return {
        total: data?.total ?? 0, due_today: data?.due ?? 0,
        words: (data?.items || []).map((w: { word: string; ru: string; streak: number; due_at: string }) => ({ word: w.word, ru: w.ru, learned: w.streak >= 1, due: w.due_at })),
      };
    }
    return "Неизвестный инструмент.";
  };

  // ---------- the conversation with the model (OpenRouter) ----------
  const key = Deno.env.get("OPENROUTER_API_KEY");
  // The whole answer must fit well inside the browser's 120 s wait; each model attempt gets at most 20 s.
  const deadline = Date.now() + 95_000;
  // A short progress summary goes with every question, so most questions about progress need no tool call.
  let summary = "";
  try {
    const { data } = await sb.rpc("list_lessons");
    summary = (data || []).map((l: Record<string, unknown>) =>
      `${l.title} (${l.slug}): решено ${l.done} из ${l.total}, с первой попытки ${l.ok}, ошибок к повторению ${l.mistakes}${l.done ? `, сейчас тема «${l.resume_title ?? "урок пройден"}»` : ""}`).join("\n");
  } catch { /* the tools can still fetch it */ }
  const system = summary ? `${SYSTEM}\n\nПрогресс ученика сейчас:\n${summary}` : SYSTEM;
  // deno-lint-ignore no-explicit-any
  const complete = async (messages: any[]) => {
    let last = "";
    for (const model of MODELS) {
      const time = Math.min(20_000, deadline - Date.now());
      if (time < 3_000) break;
      const t0 = Date.now();
      try {
        const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`, "Content-Type": "application/json",
            "HTTP-Referer": "https://english-platform-orcin.vercel.app", "X-Title": "English",
          },
          body: JSON.stringify({ model, messages, tools: TOOLS, max_tokens: 1500 }),
          signal: AbortSignal.timeout(time),
        });
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.choices?.[0]?.message) { attempts.push(`${model} 200 ${Date.now() - t0}ms`); return data.choices[0].message; }
        last = `${model} ${r.status} ${JSON.stringify(data.error || data).slice(0, 160)}`;
        attempts.push(`${last} ${Date.now() - t0}ms`);
        if (r.ok || r.status === 402 || r.status === 408 || r.status === 429 || r.status >= 500) continue;
        break;
      } catch (e) {
        last = `${model} ${String((e as Error).message || e).slice(0, 120)}`; // timeout or network: try the next model
        attempts.push(`${last} ${Date.now() - t0}ms`);
      }
    }
    throw new Error(last || "no time left");
  };
  try {
    // deno-lint-ignore no-explicit-any
    const messages: any[] = [{ role: "system", content: system }, ...history];
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const msg = await complete(messages);
      const calls = msg.tool_calls || [];
      if (!calls.length) {
        const text = String(msg.content || "").trim();
        return reply({ answer: text || "Не получилось сформулировать ответ. Попробуйте спросить иначе.", left });
      }
      messages.push({ role: "assistant", content: msg.content || "", tool_calls: calls });
      for (const call of calls) {
        let content;
        try {
          let args = {};
          try { args = JSON.parse(call.function?.arguments || "{}"); } catch { /* no arguments */ }
          content = JSON.stringify(await run(call.function?.name, args));
        } catch (e) {
          content = `Ошибка чтения данных: ${String((e as Error).message || e)}`;
        }
        messages.push({ role: "tool", tool_call_id: call.id, content });
      }
    }
    return reply({ answer: "Вопрос оказался слишком сложным. Попробуйте разбить его на части.", left });
  } catch (e) {
    console.error("ask failed", e);
    await refund();
    return reply({ error: "unavailable" }, 503);
  }
});

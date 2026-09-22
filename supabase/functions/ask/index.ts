// «Спросить»: the students' AI helper. A student asks about English or about their own progress;
// the model answers in Russian and reads the student's data through read-only tools.
// The database is queried with the student's own session, so row-level security keeps it to their data.
// The model is Google Gemini; its key is a Supabase secret (GEMINI_API_KEY) and never reaches the browser.
import { createClient } from "npm:@supabase/supabase-js@2";

// Tried in this order: when one is overloaded (503) or out of quota (429), the next one answers.
const MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"];
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

// Gemini function declarations: the same tools, without JSON-schema extras it does not take.
const TOOLS = [{
  functionDeclarations: TOOL_LIST.map(t => {
    const props = t.input_schema.properties as Record<string, unknown>;
    return Object.keys(props).length
      ? { name: t.name, description: t.description, parameters: { type: "object", properties: props, ...(t.input_schema.required ? { required: t.input_schema.required } : {}) } }
      : { name: t.name, description: t.description };
  }),
}];

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

  let body: { messages?: { role: string; text: string }[]; context?: Record<string, string> };
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  const history = (body.messages || [])
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role as "user" | "assistant", content: m.text.slice(0, MAX_TEXT) }));
  // (converted to Gemini's { role: "user" | "model", parts } below)
  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length || history[history.length - 1].role !== "user") return json({ error: "bad_request" }, 400);

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
  if (takeError) return json({ error: "server" }, 500);
  if (left < 0) return json({ error: "limit", left: 0 }, 429);

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

  // ---------- the conversation with Gemini ----------
  const key = Deno.env.get("GEMINI_API_KEY");
  // The whole answer must fit well inside the browser's 120 s wait; each model attempt gets at most 25 s.
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
  const generate = async (contents: any[]) => {
    let last = "";
    for (const model of MODELS) {
      const time = Math.min(25_000, deadline - Date.now());
      if (time < 3_000) break;
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "x-goog-api-key": key!, "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] }, contents, tools: TOOLS,
            // Short explanations at A1–A2 need little deliberation; low thinking keeps answers quick.
            generationConfig: { thinkingConfig: { thinkingLevel: "low" } },
          }),
          signal: AbortSignal.timeout(time),
        });
        if (r.ok) return await r.json();
        last = `${model} ${r.status} ${(await r.text()).slice(0, 200)}`;
        if (r.status !== 429 && r.status !== 503) break;
      } catch (e) {
        last = `${model} ${String((e as Error).message || e).slice(0, 120)}`; // timeout or network: try the next model
      }
    }
    throw new Error(last || "no time left");
  };
  try {
    // deno-lint-ignore no-explicit-any
    const contents: any[] = history.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const data = await generate(contents);
      const cand = data.candidates?.[0];
      if (!cand?.content?.parts?.length) {
        return json({ answer: "На этот вопрос я не отвечу. Давайте вернёмся к английскому: спросите про правило, слово или свою ошибку.", left });
      }
      // deno-lint-ignore no-explicit-any
      const parts: any[] = cand.content.parts;
      const calls = parts.filter(p => p.functionCall);
      if (!calls.length) {
        const text = parts.filter(p => p.text && !p.thought).map(p => p.text).join("").trim();
        return json({ answer: text || "Не получилось сформулировать ответ. Попробуйте спросить иначе.", left });
      }
      // The model's turn goes back unchanged (it carries thought signatures), then the tool results.
      contents.push(cand.content);
      const results = [];
      for (const { functionCall: fc } of calls) {
        let response;
        try { response = { result: await run(fc.name, fc.args || {}) }; }
        catch (e) { response = { error: `Ошибка чтения данных: ${String((e as Error).message || e)}` }; }
        results.push({ functionResponse: { ...(fc.id ? { id: fc.id } : {}), name: fc.name, response } });
      }
      contents.push({ role: "user", parts: results });
    }
    return json({ answer: "Вопрос оказался слишком сложным. Попробуйте разбить его на части.", left });
  } catch (e) {
    console.error("ask failed", e);
    await refund();
    return json({ error: "unavailable" }, 503);
  }
});

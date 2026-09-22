// «Спросить»: the students' AI helper. A student asks about English or about their own progress;
// Claude answers in Russian and reads the student's data through read-only tools.
// The database is queried with the student's own session, so row-level security keeps it to their data.
// The Anthropic key is a Supabase secret (ANTHROPIC_API_KEY) and never reaches the browser.
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const MODEL = "claude-opus-5";
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

const TOOLS = [
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

  // ---------- the conversation with Claude ----------
  try {
    // A key that is not scoped to a workspace needs the workspace id with every request (secret ANTHROPIC_WORKSPACE_ID).
    const workspace = Deno.env.get("ANTHROPIC_WORKSPACE_ID");
    const client = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
      ...(workspace ? { defaultHeaders: { "anthropic-workspace-id": workspace } } : {}),
    });
    // deno-lint-ignore no-explicit-any
    const messages: any[] = history;
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      // Server-side fallbacks: if Opus 5 declines, the API re-runs the request on the recommended model.
      // deno-lint-ignore no-explicit-any
      const response: any = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        output_config: { effort: "medium" },
        system: SYSTEM,
        tools: TOOLS,
        messages,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      // deno-lint-ignore no-explicit-any
      } as any);

      if (response.stop_reason === "refusal") {
        return json({ answer: "На этот вопрос я не отвечу. Давайте вернёмся к английскому: спросите про правило, слово или свою ошибку.", left });
      }
      const text = response.content.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n").trim();
      if (response.stop_reason !== "tool_use") {
        return json({ answer: text || "Не получилось сформулировать ответ. Попробуйте спросить иначе.", left });
      }
      messages.push({ role: "assistant", content: response.content });
      const results = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        try {
          results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(await run(block.name, block.input || {})) });
        } catch (e) {
          results.push({ type: "tool_result", tool_use_id: block.id, content: `Ошибка чтения данных: ${String((e as Error).message || e)}`, is_error: true });
        }
      }
      messages.push({ role: "user", content: results });
    }
    return json({ answer: "Вопрос оказался слишком сложным. Попробуйте разбить его на части.", left });
  } catch (e) {
    console.error("ask failed", e);
    await refund();
    const err = e as { status?: number; message?: string };
    return json({ error: "unavailable", detail: `${err.status ?? ""} ${String(err.message || e).slice(0, 300)}`.trim() }, 503);
  }
});

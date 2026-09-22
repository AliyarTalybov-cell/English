// «Спросить»: a quiet panel for questions to the AI helper. On a phone it comes up from the bottom,
// on a wide screen it slides in from the right. The conversation lives only while the panel is open.
// Opened from a mistake, it carries the task, the answer and the site's hint; the student asks their own question.
import { api, AuthRequired } from "./api.js";
import { esc } from "./engine.js";

const SUGGEST = ["Что мне повторить сегодня?", "В каких темах я чаще ошибаюсь?", "Объясни проще последнюю тему"];
const SUGGEST_TASK = ["Почему мой ответ неверный?", "Объясни правило проще", "Дай ещё пример"];
const SEND_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
const RETRY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/></svg>';
const X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const plural = (n, one, few, many) => {
  const t = Math.abs(n) % 100, d = t % 10;
  if (t > 10 && t < 20) return many;
  if (d > 1 && d < 5) return few;
  return d === 1 ? one : many;
};

// The answer may use **bold**, *italic*, `code` and short "- " lists; everything else stays plain text.
function renderAnswer(text) {
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  const out = [];
  let list = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const item = line.match(/^[-•*]\s+(.*)$/);
    if (item) { (list ||= []).push(`<li>${inline(item[1])}</li>`); continue; }
    if (list) { out.push(`<ul>${list.join("")}</ul>`); list = null; }
    if (line) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push(`<ul>${list.join("")}</ul>`);
  return out.join("");
}

let panel = null;

export function openAsk({ context = null, onAuth } = {}) {
  if (panel) { if (context) panel.askAbout(context); return; }
  const messages = [];
  let busy = false, left = null;

  const root = document.createElement("div");
  root.className = "ask-backdrop";
  root.innerHTML = `
    <aside class="ask-panel" role="dialog" aria-modal="true" aria-labelledby="ask-title">
      <header class="ask-head">
        <h2 id="ask-title">Спросить</h2>
        <button type="button" class="ask-close" data-close aria-label="Закрыть">${X_ICON}</button>
      </header>
      <div class="ask-body">
        <div class="ask-empty">
          <p data-empty-text></p>
          <div class="ask-suggest"></div>
        </div>
        <ol class="ask-log" aria-live="polite"></ol>
      </div>
      <div class="ask-foot">
        <div class="ask-ctx" hidden><div class="ask-ctx-text"></div><button type="button" class="ask-close" data-ctx-clear aria-label="Не прикреплять задание">${X_ICON}</button></div>
        <form class="ask-form">
          <textarea class="inp ask-input" rows="1" maxlength="2000" placeholder="Ваш вопрос" aria-label="Ваш вопрос"></textarea>
          <button class="ask-send" type="submit" aria-label="Отправить" disabled>${SEND_ICON}</button>
        </form>
        <p class="ask-note"><span data-left></span>Вопросы и ваш прогресс передаются ИИ-помощнику.</p>
      </div>
    </aside>`;
  document.body.appendChild(root);
  document.documentElement.classList.add("no-scroll");
  requestAnimationFrame(() => root.classList.add("open"));

  const log = root.querySelector(".ask-log"), empty = root.querySelector(".ask-empty");
  const input = root.querySelector(".ask-input"), send = root.querySelector(".ask-send"), leftEl = root.querySelector("[data-left]");
  const body = root.querySelector(".ask-body");
  const showLeft = () => {
    // The allowance is mentioned only when it is nearly used up.
    leftEl.textContent = left === null || left > 5 ? "" : left > 0
      ? `Осталось ${left} ${plural(left, "вопрос", "вопроса", "вопросов")} на сегодня · `
      : "Вопросы на сегодня закончились, завтра будут новые · ";
    send.disabled = busy || left === 0 || !input.value.trim();
  };
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };
  const add = (cls, html) => {
    const li = document.createElement("li");
    li.className = cls; li.innerHTML = html;
    log.appendChild(li);
    empty.hidden = true;
    scrollDown();
    return li;
  };

  api.aiLeft().then(n => { left = n; showLeft(); }).catch(() => {});

  // A task from the lesson: shown above the input and sent with the next question.
  let ctx = null;
  const ctxBox = root.querySelector(".ask-ctx"), ctxText = root.querySelector(".ask-ctx-text");
  const suggest = root.querySelector(".ask-suggest"), emptyText = root.querySelector("[data-empty-text]");
  const drawSuggest = () => {
    const list = ctx ? SUGGEST_TASK : SUGGEST;
    emptyText.textContent = ctx ? "Спросите, что непонятно в этом задании: своими словами или одной из подсказок."
      : "Спросите про правило, слово или свою ошибку. Отвечу по-русски и с учётом вашего прогресса.";
    suggest.innerHTML = list.map(s => `<button type="button" class="ask-chip">${esc(s)}</button>`).join("");
    suggest.querySelectorAll(".ask-chip").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
  };
  const setContext = c => {
    ctx = c && c.task ? c : null;
    ctxBox.hidden = !ctx;
    ctxText.innerHTML = ctx ? `<span><b>Задание</b>${esc(ctx.task)}</span>${ctx.answer ? `<span><b>Ваш ответ</b>${esc(ctx.answer)}</span>` : ""}` : "";
    input.placeholder = ctx ? "Ваш вопрос об этом задании" : "Ваш вопрос";
    if (!log.children.length) drawSuggest();
  };
  const contextText = c => [
    c.lesson && `Урок: ${c.lesson}`, c.topic && `Тема: ${c.topic}`, `Задание: ${c.task}`,
    c.answer && `Мой ответ: ${c.answer}`, c.feedback && `Сайт написал: ${c.feedback}`,
  ].filter(Boolean).join("\n");

  // Sends the conversation; `wait` is the placeholder that becomes the answer (or the error with «Повторить»).
  const request = async (wait, used) => {
    busy = true; showLeft();
    wait.className = "ask-a ask-wait"; wait.setAttribute("aria-label", "Думаю");
    wait.innerHTML = "<span></span><span></span><span></span>";
    scrollDown();
    try {
      const res = await api.ask(messages, null);
      messages.push({ role: "assistant", text: res.answer });
      wait.className = "ask-a"; wait.removeAttribute("aria-label");
      wait.innerHTML = renderAnswer(res.answer);
      if (typeof res.left === "number") left = res.left;
    } catch (err) {
      if (err instanceof AuthRequired) { close(); onAuth?.(err); return; }
      wait.className = "ask-a ask-err"; wait.removeAttribute("aria-label");
      if (err.code === "limit") {
        left = 0;
        wait.textContent = "Вопросы на сегодня закончились. Завтра можно будет спросить снова.";
      } else {
        wait.innerHTML = `<p>${navigator.onLine === false ? "Нет связи с интернетом." : "Помощник сейчас перегружен, вопрос не списался."}</p>
          <button type="button" class="ask-retry">${RETRY_ICON}<span>Повторить</span></button>`;
        wait.querySelector(".ask-retry").addEventListener("click", () => { if (!busy) request(wait, used); });
      }
    } finally {
      busy = false; showLeft(); scrollDown();
    }
  };

  const ask = async text => {
    text = text.trim();
    if (!text || busy || left === 0) return;
    const used = ctx;
    add("ask-q", `${used ? `<small>${esc(used.task)}${used.answer ? ` · ваш ответ: ${esc(used.answer)}` : ""}</small>` : ""}${esc(text)}`);
    // The task goes into the message itself, so later questions in this conversation still see it.
    messages.push({ role: "user", text: used ? `${contextText(used)}\n\n${text}` : text });
    setContext(null);
    // A failed question stays in the conversation: «Повторить» sends it again.
    await request(add("ask-a", ""), used);
  };

  const close = () => {
    root.classList.remove("open");
    document.documentElement.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => root.remove(), 300);
    panel = null;
  };
  const onKey = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  root.addEventListener("click", e => { if (e.target === root) close(); });
  root.querySelector("[data-close]").addEventListener("click", close);
  root.querySelector("[data-ctx-clear]").addEventListener("click", () => { setContext(null); input.focus(); });
  root.querySelector(".ask-form").addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    grow();
    ask(text);
  });
  // The input grows with the text up to five lines.
  const grow = () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 140) + "px"; showLeft(); };
  input.addEventListener("input", grow);
  // Enter sends, Shift+Enter makes a new line.
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); root.querySelector(".ask-form").requestSubmit(); }
  });

  panel = { askAbout: c => { setContext(c); input.focus({ preventScroll: true }); } };
  setContext(context);
  if (matchMedia("(min-width: 860px)").matches) setTimeout(() => input.focus(), 250);
}

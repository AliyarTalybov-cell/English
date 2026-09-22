// «Спросить»: a quiet panel for questions to the AI helper. On a phone it comes up from the bottom,
// on a wide screen it slides in from the right. The conversation lives only while the panel is open.
import { api, AuthRequired } from "./api.js";
import { esc } from "./engine.js";

const SUGGEST = ["Что мне повторить сегодня?", "В каких темах я чаще ошибаюсь?", "Объясни проще последнюю тему"];
const plural = (n, one, few, many) => {
  const t = Math.abs(n) % 100, d = t % 10;
  if (t > 10 && t < 20) return many;
  if (d > 1 && d < 5) return few;
  return d === 1 ? one : many;
};

// The answer may use **bold**, `code` and short "- " lists; everything else stays plain text.
function renderAnswer(text) {
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
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
        <button type="button" class="ask-close" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </header>
      <div class="ask-body">
        <div class="ask-empty">
          <p>Спросите про правило, слово или свою ошибку. Отвечу по-русски и с учётом вашего прогресса.</p>
          <div class="ask-suggest">${SUGGEST.map(s => `<button type="button" class="ask-chip">${esc(s)}</button>`).join("")}</div>
        </div>
        <ol class="ask-log" aria-live="polite"></ol>
      </div>
      <form class="ask-form">
        <textarea class="inp ask-input" rows="2" maxlength="2000" placeholder="Ваш вопрос" aria-label="Ваш вопрос"></textarea>
        <button class="btn ask-send" type="submit">Спросить</button>
      </form>
      <p class="ask-note"><span data-left></span>Вопросы и ваш прогресс передаются ИИ-помощнику.</p>
    </aside>`;
  document.body.appendChild(root);
  document.documentElement.classList.add("no-scroll");
  requestAnimationFrame(() => root.classList.add("open"));

  const log = root.querySelector(".ask-log"), empty = root.querySelector(".ask-empty");
  const input = root.querySelector(".ask-input"), send = root.querySelector(".ask-send"), leftEl = root.querySelector("[data-left]");
  const body = root.querySelector(".ask-body");
  const showLeft = () => {
    leftEl.textContent = left === null ? "" : left > 0
      ? `Осталось ${left} ${plural(left, "вопрос", "вопроса", "вопросов")} на сегодня · `
      : "Вопросы на сегодня закончились, завтра будут новые · ";
    send.disabled = busy || left === 0;
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

  const ask = async (text, ctx = null) => {
    text = text.trim();
    if (!text || busy || left === 0) return;
    busy = true; showLeft();
    add("ask-q", `${ctx?.task ? `<small>${esc(ctx.task)}${ctx.answer ? ` · ваш ответ: ${esc(ctx.answer)}` : ""}</small>` : ""}${esc(text)}`);
    messages.push({ role: "user", text });
    const wait = add("ask-a ask-wait", "<span></span><span></span><span></span>");
    wait.setAttribute("aria-label", "Думаю");
    try {
      const res = await api.ask(messages, ctx);
      messages.push({ role: "assistant", text: res.answer });
      wait.className = "ask-a"; wait.removeAttribute("aria-label");
      wait.innerHTML = renderAnswer(res.answer);
      if (typeof res.left === "number") left = res.left;
    } catch (err) {
      messages.pop();
      if (err instanceof AuthRequired) { close(); onAuth?.(err); return; }
      wait.className = "ask-a ask-err"; wait.removeAttribute("aria-label");
      if (err.code === "limit") { left = 0; wait.textContent = "Вопросы на сегодня закончились. Завтра можно будет спросить снова."; }
      else wait.textContent = "Не получилось получить ответ. Проверьте интернет и попробуйте ещё раз.";
    } finally {
      busy = false; showLeft(); scrollDown();
    }
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
  root.querySelector(".ask-close").addEventListener("click", close);
  root.querySelectorAll(".ask-chip").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
  root.querySelector(".ask-form").addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    ask(text);
  });
  // Enter sends, Shift+Enter makes a new line.
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); root.querySelector(".ask-form").requestSubmit(); }
  });

  panel = { askAbout: ctx => ask("Почему мой ответ неверный? Объясни правило.", ctx) };
  if (context) panel.askAbout(context);
  else if (matchMedia("(min-width: 860px)").matches) setTimeout(() => input.focus(), 250);
}

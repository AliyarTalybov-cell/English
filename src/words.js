// «Мои слова»: the saved-words dictionary, the study mode (cards, choice, typing) and the words line in «Ваш прогресс».
import { api, roles, cache, AuthRequired } from "./api.js";
import { translate } from "./translate.js";
import { esc, sayButton } from "./engine.js";
import { stopSpeech, speakEnglish } from "./speech.js";

// Screen helpers live in main.js; it hands them over once at start-up.
let ui = null;
export function setupWords(helpers) { ui = helpers; }

// « · выучено 11 слов из 16» after the solved-tasks line; nothing while there are no saved words.
export function wordsNote(w, href = "") {
  if (!w?.total) return "";
  const n = w.learned || 0;
  const text = `выучено <b>${n}</b> ${ui.plural(n, "слово", "слова", "слов")} из ${w.total}`;
  return ` · ${href ? `<a class="words-note" href="${href}">${text}</a>` : `<span class="words-note">${text}</span>`}`;
}
export async function fillWordsLine() {
  try {
    const d = await api.myWords(false, 1, 0);
    const w = { total: d.total || 0, learned: d.learned || 0 };
    cache.set("wordstats", w);
    const el = ui.app.querySelector("[data-words-line]");
    if (el) el.innerHTML = wordsNote(w, "#/words");
  } catch {}
}


/* ---------- my words: saved translations, trained with cards ---------- */
const DAY = 86400000;
// «Знаю» (or a right answer in the quiz) makes a word learned; «Ещё учу» or a mistake takes it back.
// A learned word still comes back for review on the usual schedule.
const isDue = w => new Date(w.due_at).getTime() <= Date.now();
const isLearned = w => w.streak >= 1;
const REVIEW_GAP = [1, 1, 3, 7, 14, 30]; // days after a streak of 0..5, like _review_gap in the database
function wordStatus(w) {
  if (isDue(w)) return isLearned(w) ? "выучено · повторить сегодня" : "повторить сегодня";
  const days = Math.max(1, Math.ceil((new Date(w.due_at).getTime() - Date.now()) / DAY));
  const when = days === 1 ? "завтра" : `через ${days} ${ui.plural(days, "день", "дня", "дней")}`;
  return isLearned(w) ? `выучено · повтор ${when}` : `повтор ${when}`;
}

// The list keeps its search and filter while the data refreshes in the background.
const wordsView = { q: "", filter: "all", shown: 60 };
// Removal waits a few seconds so «Вернуть» in the toast can undo it.
const pendingRemovals = new Map(); // word -> timer

async function loadAllWords() {
  const first = await api.myWords(false, 100, 0);
  const pages = Math.ceil((first.total || 0) / 100);
  if (pages <= 1) return first;
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, k) => api.myWords(false, 100, (k + 1) * 100)));
  return { ...first, items: [...first.items, ...rest.flatMap(r => r.items || [])] };
}

function undoToast(text, onUndo) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast has-action"; t.setAttribute("role", "status");
  t.innerHTML = `<span>${esc(text)}</span><button type="button">Вернуть</button>`;
  const hide = () => { t.classList.add("out"); setTimeout(() => t.remove(), 250); };
  t.querySelector("button").addEventListener("click", () => { onUndo(); hide(); });
  document.body.appendChild(t);
  setTimeout(hide, 4000);
}

export async function renderWords() {
  ui.removeFloating();
  document.title = "Мои слова · English";
  const token = ui.newScreen();
  let items = [];
  const v = wordsView;

  const visible = () => items.filter(w => !pendingRemovals.has(w.word));
  const picked = () => {
    const q = v.q.trim().toLowerCase();
    let list = visible();
    if (v.filter === "due") list = list.filter(isDue);
    if (v.filter === "learned") list = list.filter(isLearned);
    if (q) list = list.filter(w => w.word.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q));
    // Words from the teacher stay on top until the first training answer.
    if (v.filter !== "due") list = [...list.filter(w => w.from_teacher), ...list.filter(w => !w.from_teacher)];
    if (v.filter === "due") list = list.slice().sort((a, b) => new Date(a.due_at) - new Date(b.due_at));
    return list;
  };

  const paint = () => {
    const all = visible(), due = all.filter(isDue).length, learned = all.filter(isLearned).length;
    if (!all.length) v.filter = "all";
    ui.app.innerHTML = ui.topbar(true) + `
      <main class="wrap screen">
        <header class="hero">
          <p class="kicker">Словарь</p>
          <h1>Мои слова</h1>
          <p class="lead">Слова, которые вы сохранили из перевода по тапу в уроках. Тренируются карточками: слово — перевод.</p>
        </header>
        ${all.length ? `
          <div class="words-top">
            <p class="hint-line"><b>${all.length}</b> ${ui.plural(all.length, "слово", "слова", "слов")}${due ? ` · <b>${due}</b> ждут повторения` : " · на сегодня всё изучено"}</p>
            <button class="btn" type="button" data-train>${due ? "Повторить слова" : "Учить слова"}</button>
          </div>
          <div class="words-tools">
            <label class="search" for="words-search">
              <span class="search-ico">${ui.icons.search}</span>
              <input class="inp" id="words-search" type="search" placeholder="Найти слово или перевод" aria-label="Найти слово или перевод" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" value="${esc(v.q)}" data-search>
            </label>
            <div class="words-filter">
              <div class="seg" role="tablist" aria-label="Какие слова показать">
                ${[["all", "Все", all.length], ["due", "Повторить", due], ["learned", "Выучено", learned]].map(([id, name, n]) =>
                  `<button type="button" role="tab" aria-selected="${v.filter === id}" data-filter="${id}">${name} <small>${n}</small></button>`).join("")}
              </div>
            </div>
            <p class="words-legend" aria-hidden="true"><span><i class="word-dot"></i>повторить сегодня</span><span><i class="word-tick">${CHECK_ICON}</i>выучено</span><span>нажмите на слово, чтобы поправить перевод</span></p>
          </div>
          <ul class="words-list" data-list></ul>
          <p class="empty words-empty" data-empty hidden></p>
          <div class="more-line"><button type="button" class="btn quiet" data-more hidden>Показать ещё</button></div>
          <div class="words-clear" data-clear-box><button type="button" class="inline-link words-clear-link" data-clear>Удалить все слова</button></div>`
        : `<p class="empty">Пока пусто. В уроке нажмите на любое английское слово, а в подсказке с переводом — значок закладки, и слово попадёт сюда.</p>`}
        <p class="back-line"><a class="back" href="#/">← Все уроки</a></p>
      </main>`;
    ui.bindTopbar();
    const main = ui.app.querySelector("main");
    if (!all.length) return;
    const list = main.querySelector("[data-list]"), empty = main.querySelector("[data-empty]"), more = main.querySelector("[data-more]");

    const counts = () => {
      const now = visible(), due = now.filter(isDue).length;
      main.querySelector(".words-top .hint-line").innerHTML = `<b>${now.length}</b> ${ui.plural(now.length, "слово", "слова", "слов")}${due ? ` · <b>${due}</b> ждут повторения` : " · на сегодня всё изучено"}`;
      const n = { all: now.length, due, learned: now.filter(isLearned).length };
      main.querySelectorAll("[data-filter] small").forEach(el => { el.textContent = n[el.parentElement.dataset.filter]; });
    };
    const drawList = (animate = false) => {
      counts();
      const found = picked(), part = found.slice(0, v.shown);
      // Newest-first lists are split by when the word was added: today, this week, earlier.
      const grouped = v.filter !== "due";
      let lastGroup = "";
      list.innerHTML = part.map((w, k) => {
        const g = grouped ? addedGroup(w) : "";
        const head = g && g !== lastGroup ? `<li class="word-group${animate && k < 12 ? " in" : ""}" style="--i:${k}" aria-hidden="true">${g}</li>` : "";
        lastGroup = g;
        return head + wordRow(w, animate && k < 12 ? k : -1);
      }).join("");
      list.querySelectorAll("[data-say-slot]").forEach(slot => slot.replaceWith(sayButton(slot.dataset.saySlot, `Послушать ${slot.dataset.saySlot}`)));
      more.hidden = found.length <= v.shown;
      empty.hidden = !!found.length;
      empty.textContent = v.q.trim() ? "Ничего не нашлось. Попробуйте другое написание."
        : v.filter === "due" ? "На сегодня всё изучено."
        : v.filter === "learned" ? "Выученных пока нет. Нажмите «Знаю» на карточке, и слово появится здесь." : "";
    };
    drawList(true);

    main.querySelector("[data-train]").addEventListener("click", () => startWordTraining());
    const search = main.querySelector("[data-search]");
    search.addEventListener("input", () => { v.q = search.value; v.shown = 60; drawList(); });
    main.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => {
      v.filter = b.dataset.filter; v.shown = 60;
      main.querySelectorAll("[data-filter]").forEach(x => x.setAttribute("aria-selected", String(x === b)));
      drawList(true);
    }));
    more.addEventListener("click", () => { v.shown += 60; drawList(); });

    // «Удалить все слова»: asked in place, no undo — everything goes at once.
    const clearBox = main.querySelector("[data-clear-box]");
    const clearLink = () => {
      clearBox.innerHTML = `<button type="button" class="inline-link words-clear-link" data-clear>Удалить все слова</button>`;
    };
    clearBox.addEventListener("click", async e => {
      if (e.target.closest("[data-clear]")) {
        const n = visible().length;
        clearBox.innerHTML = `<div class="words-confirm" role="group" aria-label="Удалить все слова">
          <p>Удалить все ${n} ${ui.plural(n, "слово", "слова", "слов")}? Вместе с ними пропадёт и история повторений. Отменить это будет нельзя.</p>
          <div class="acct-actions"><button type="button" class="btn warn" data-clear-yes>Удалить все</button><button type="button" class="btn quiet" data-clear-no>Отмена</button></div>
        </div>`;
        clearBox.querySelector("[data-clear-no]").focus({ preventScroll: true });
        clearBox.scrollIntoView({ block: "nearest", behavior: ui.reduced() ? "auto" : "smooth" });
        return;
      }
      if (e.target.closest("[data-clear-no]")) { clearLink(); clearBox.querySelector("[data-clear]").focus(); return; }
      const yes = e.target.closest("[data-clear-yes]");
      if (!yes) return;
      yes.disabled = true; yes.classList.add("loading");
      try {
        await api.removeAllWords();
        pendingRemovals.forEach(t => clearTimeout(t)); pendingRemovals.clear();
        items = [];
        cache.set("words", { total: 0, due: 0, items: [] });
        ui.toast("Все слова удалены");
        if (ui.isScreen(token)) paint();
      } catch (err) {
        if (err instanceof AuthRequired) { ui.handleError(err); return; }
        yes.disabled = false; yes.classList.remove("loading");
        ui.toast("Не удалось удалить. Попробуйте ещё раз.");
      }
    });

    // Fix a translation in place: the row turns into a small form, Enter saves, Esc or «Отмена» puts it back.
    const openEdit = li => {
      const word = li.querySelector("[data-edit]").dataset.edit, w = items.find(x => x.word === word);
      if (!w) return;
      // Only one row is edited at a time: close the other one first and find this row again.
      if (list.querySelector(".word-edit")) {
        drawList();
        li = list.querySelector(`[data-edit="${CSS.escape(word)}"]`)?.closest("li");
        if (!li) return;
      }
      li.classList.add("editing");
      li.innerHTML = `<form class="word-edit" data-edit-form>
        <label class="word-edit-label" for="word-edit-input"><b lang="en">${esc(w.word)}</b> — перевод</label>
        <input class="inp" id="word-edit-input" maxlength="200" autocomplete="off" enterkeyhint="done" value="${esc(w.ru)}">
        <div class="acct-actions"><button class="btn" type="submit">Сохранить</button><button class="btn quiet" type="button" data-edit-cancel>Отмена</button></div>
      </form>`;
      const form = li.querySelector("form"), input = form.querySelector("input");
      input.focus(); input.select();
      input.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); drawList(); } });
      form.querySelector("[data-edit-cancel]").addEventListener("click", () => drawList());
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const ru = input.value.trim();
        if (!ru) { input.focus(); return; }
        if (ru === w.ru) { drawList(); return; }
        const btn = form.querySelector("[type=submit]");
        btn.disabled = true; btn.classList.add("loading");
        try {
          await api.addWord(w.word, ru);
          w.ru = ru;
          cache.set("words", { ...(cache.get("words") || {}), total: items.length, due: items.filter(isDue).length, items });
          drawList();
          ui.toast("Перевод сохранён");
        } catch (err) {
          if (err instanceof AuthRequired) { ui.handleError(err); return; }
          btn.disabled = false; btn.classList.remove("loading");
          ui.toast("Не удалось сохранить. Попробуйте ещё раз.");
        }
      });
    };

    list.addEventListener("click", e => {
      const edit = e.target.closest("[data-edit]");
      if (edit) { openEdit(edit.closest("li")); return; }
      const del = e.target.closest("[data-remove]");
      if (!del) return;
      const li = del.closest("li"), word = del.dataset.remove;
      const timer = setTimeout(async () => {
        pendingRemovals.delete(word);
        try {
          await api.removeWord(word);
          items = items.filter(w => w.word !== word);
          cache.set("words", { ...cache.get("words"), total: items.length, due: items.filter(isDue).length, items });
        } catch (err) {
          if (err instanceof AuthRequired) { ui.handleError(err); return; }
          ui.toast("Не удалось удалить. Попробуйте ещё раз.");
          if (ui.isScreen(token)) paint();
        }
      }, 4200);
      pendingRemovals.set(word, timer);
      const gone = () => { if (ui.isScreen(token)) (visible().length ? drawList() : paint()); };
      if (ui.reduced()) gone();
      else { li.style.height = li.offsetHeight + "px"; li.classList.add("leaving"); setTimeout(gone, 260); }
      undoToast("Слово удалено", () => {
        clearTimeout(pendingRemovals.get(word));
        pendingRemovals.delete(word);
        if (ui.isScreen(token)) paint();
      });
    });
  };

  const saved = cache.get("words");
  if (saved) { items = saved.items || []; paint(); }
  else {
    ui.app.innerHTML = ui.topbar(true) + `<main class="wrap" aria-busy="true"><div class="skel-wrap" aria-label="Загружаю слова"><div class="skel line" style="width:30%"></div><div class="skel title"></div><div class="skel row"></div><div class="skel row"></div><div class="skel row"></div></div></main>`;
    ui.bindTopbar();
  }
  try {
    const data = await loadAllWords();
    if (!ui.isScreen(token)) return;
    cache.set("words", data);
    // Compare what the screen shows, not exact timestamps, so a fresh copy of the same list does not repaint it.
    const look = d => (d.items || []).map(w => [w.word, w.ru, w.streak, isDue(w), wordStatus(w)].join("|")).join("\n");
    if (!saved || look(saved) !== look(data)) {
      const q = document.activeElement?.matches?.("[data-search]");
      items = data.items || []; paint();
      if (q) ui.app.querySelector("[data-search]")?.focus({ preventScroll: true });
    }
  } catch (err) { if (!saved) ui.handleError(err); }
}

function addedGroup(w) {
  if (w.from_teacher) return "От учителя";
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const t = new Date(w.added_at).getTime();
  if (t >= start.getTime()) return "Сегодня";
  if (t >= start.getTime() - 6 * DAY) return "На этой неделе";
  return "Раньше";
}

const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

// One compact line: word, translation, a small mark for the status (dot — to review today, tick — learned).
function wordRow(w, k = -1) {
  const status = wordStatus(w);
  const mark = isDue(w) ? `<i class="word-dot"></i>` : isLearned(w) ? `<i class="word-tick">${CHECK_ICON}</i>` : "";
  return `<li class="word-row${k >= 0 ? " in" : ""}"${k >= 0 ? ` style="--i:${k}"` : ""}>
    <button type="button" class="word-main" title="${status}. Нажмите, чтобы поправить перевод" data-edit="${esc(w.word)}"><b lang="en">${esc(w.word)}</b><span>${esc(w.ru)}</span><span class="visually-hidden">, ${status}. Изменить перевод</span></button>
    <span class="word-mark" aria-hidden="true">${mark}</span>
    <span data-say-slot="${esc(w.word)}"></span>
    <button type="button" class="icon-btn quiet danger" aria-label="Удалить слово ${esc(w.word)}" title="Удалить слово" data-remove="${esc(w.word)}">${ui.icons.trash}</button>
  </li>`;
}

// Study mode: a full screen with two ways to work — flip cards («Знаю» / «Ещё учу») and a four-option quiz.
export async function startWordTraining() {
  let words = [], all = [];
  try {
    all = (await loadAllWords()).items || [];
  } catch (err) {
    if (err instanceof AuthRequired) { ui.handleError(err); return; }
    ui.toast("Не удалось загрузить слова.");
    return;
  }
  const shuffle = arr => arr.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  // Up to 20 words: the ones due today (oldest first); with nothing due — words not learned yet, then any others.
  const due = all.filter(isDue).sort((a, b) => new Date(a.due_at) - new Date(b.due_at));
  words = (due.length ? due : [...shuffle(all.filter(w => !isLearned(w))), ...shuffle(all.filter(isLearned))]).slice(0, 20);
  if (!words.length) { ui.toast("Слов пока нет."); return; }
  // Wrong options come from the whole dictionary, not only from today's words.
  const pool = all.length >= 4 ? all : [];
  let mode = "cards", deck = shuffle(words), i = 0;
  let known = [], learning = [], right = 0, mistakes = [], answered = 0, busy = false;
  // A word goes to the schedule once per session, and again only when the answer changes
  // (for example «Ещё учу» first and «Знаю» on the second round).
  const counted = new Map(), wrongFirst = new Set(); // word -> last answer sent; words answered both ways
  const record = (word, ok) => {
    if (counted.get(word) === ok) return;
    if (counted.has(word)) wrongFirst.add(word);
    counted.set(word, ok); answered++;
    api.wordResult(word, ok).catch(() => {});
  };
  // The last card answer is sent only when the next one is given (or the round ends), so «Отменить» can take it back.
  let pending = null; // { card, ok }
  const flush = () => { if (pending) { record(pending.card.word, pending.ok); pending = null; } };
  // The dictionary list is updated right here, so closing the study screen needs no reload.
  const saved = cache.get("words");
  const wait = ms => new Promise(r => setTimeout(r, ui.reduced() ? 0 : ms));

  const opener = document.activeElement;
  const root = document.createElement("div");
  root.className = "study";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Учить слова");
  root.innerHTML = `
    <header class="study-head">
      <button type="button" class="icon-btn" aria-label="Закрыть" data-close>${ui.icons.close}</button>
      <div class="tabs study-tabs" role="tablist" data-active="cards">
        <button type="button" role="tab" aria-selected="true" data-mode="cards">Карточки</button>
        <button type="button" role="tab" aria-selected="false" data-mode="quiz"${pool.length ? "" : " disabled title='Нужно хотя бы 4 слова'"}>Выбор</button>
        <button type="button" role="tab" aria-selected="false" data-mode="write">Написать</button>
      </div>
      <p class="study-count" data-count></p>
    </header>
    <div class="study-progress" aria-hidden="true"><i data-progress></i></div>
    <main class="study-body" data-body></main>`;
  document.body.appendChild(root);
  document.documentElement.classList.add("no-scroll");
  const body = root.querySelector("[data-body]");

  const close = () => {
    flush();
    document.removeEventListener("keydown", onKey);
    document.documentElement.classList.remove("no-scroll");
    root.classList.add("out");
    setTimeout(() => root.remove(), ui.reduced() ? 0 : 140);
    opener?.focus?.({ preventScroll: true });
    stopSpeech();
    if (answered && saved) {
      const items = (saved.items || []).map(w => {
        if (!counted.has(w.word)) return w;
        const streak = !counted.get(w.word) ? 0 : wrongFirst.has(w.word) ? 1 : w.streak + 1;
        return { ...w, streak, from_teacher: false, due_at: new Date(Date.now() + REVIEW_GAP[Math.min(streak, 5)] * DAY).toISOString() };
      });
      cache.set("words", { ...saved, items, due: items.filter(isDue).length });
    }
    if (answered && location.hash.startsWith("#/words")) renderWords();
  };
  root.querySelector("[data-close]").addEventListener("click", close);
  root.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
    if (b.disabled || b.dataset.mode === mode || busy) return;
    flush();
    mode = b.dataset.mode;
    root.querySelector(".study-tabs").dataset.active = mode;
    root.querySelectorAll("[data-mode]").forEach(x => x.setAttribute("aria-selected", String(x === b)));
    restart(shuffle(words));
  }));

  const progress = () => {
    const done = Math.min(i, deck.length);
    root.querySelector("[data-count]").textContent = i < deck.length ? `${i + 1} / ${deck.length}` : "";
    root.querySelector("[data-progress]").style.width = `${(done / deck.length) * 100}%`;
  };

  const onKey = e => {
    if (e.key === "Escape") { close(); return; }
    if (mode !== "cards" || !root.querySelector(".flip")) return;
    if (e.key === "Backspace" || (e.key === "z" && (e.metaKey || e.ctrlKey))) { e.preventDefault(); undo(); return; }
    if (e.key === "ArrowRight") decide(true);
    if (e.key === "ArrowLeft") decide(false);
    if (e.key === " " || e.key === "Enter") { if (e.target.closest?.("button:not(.flip)")) return; e.preventDefault(); root.querySelector(".flip").click(); }
  };
  document.addEventListener("keydown", onKey);

  /* cards */
  let decide = () => {};
  const undo = () => {
    if (!pending || busy || i === 0) return;
    (pending.ok ? known : learning).pop();
    pending = null;
    i--;
    drawCard("back");
  };
  const drawCard = (from = "") => {
    const c = deck[i];
    progress();
    body.innerHTML = `
      <div class="deck">
        <div class="flip${from ? " enter" : ""}" role="button" tabindex="0" aria-label="Карточка: ${esc(c.word)}. Нажмите, чтобы перевернуть" data-flip>
          <div class="flip-inner">
            <div class="flip-face front"><span class="flip-word" lang="en">${esc(c.word)}</span></div>
            <div class="flip-face back" aria-hidden="true"><span class="flip-small" lang="en">${esc(c.word)}</span><span class="flip-word">${esc(c.ru)}</span></div>
          </div>
          <span class="flip-say" data-say></span>
        </div>
      </div>
      <div class="study-choice">
        <button type="button" class="btn quiet" data-no>Ещё учу</button>
        <button type="button" class="btn ghost" data-yes>Знаю</button>
      </div>
      <div class="study-undo">${pending ? `<button type="button" class="inline-link" data-undo>Отменить: ${esc(pending.card.word)} — ${pending.ok ? "знаю" : "ещё учу"}</button>` : ""}</div>
      <p class="study-hint">Нажмите на карточку, чтобы перевернуть.<br>Смахните вправо, если знаете, влево — если ещё учите.</p>`;
    body.querySelector("[data-undo]")?.addEventListener("click", undo);
    const card = body.querySelector(".flip"), face = card.querySelector(".flip-inner");
    const say = sayButton(c.word, `Послушать ${c.word}`);
    body.querySelector("[data-say]").replaceWith(say);
    say.classList.add("flip-say");
    const flip = () => {
      card.classList.toggle("turned");
      card.querySelector(".front").setAttribute("aria-hidden", String(card.classList.contains("turned")));
      card.querySelector(".back").setAttribute("aria-hidden", String(!card.classList.contains("turned")));
    };
    card.addEventListener("click", e => { if (!e.target.closest(".say") && !moved) flip(); });
    body.querySelector("[data-yes]").addEventListener("click", () => decide(true));
    body.querySelector("[data-no]").addEventListener("click", () => decide(false));

    decide = async ok => {
      if (busy) return;
      busy = true;
      stopSpeech();
      flush();
      pending = { card: c, ok };
      (ok ? known : learning).push(c);
      navigator.vibrate?.(8);
      card.style.transition = "";
      card.style.transform = "";
      card.classList.add(ok ? "fly-right" : "fly-left");
      await wait(230);
      i++; busy = false;
      if (i < deck.length) drawCard(ok ? "right" : "left"); else finish();
    };

    // The card follows the finger, leans a little and shows which way it is going; a long enough swipe decides.
    let x0 = null, y0 = 0, dx = 0, moved = false, sideways = null;
    card.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" || e.target.closest(".say")) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; sideways = null;
    });
    card.addEventListener("pointermove", e => {
      if (x0 === null) return;
      dx = e.clientX - x0;
      const dy = e.clientY - y0;
      if (sideways === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) sideways = Math.abs(dx) > Math.abs(dy);
      if (!sideways) return;
      moved = true;
      card.setPointerCapture?.(e.pointerId);
      card.style.transition = "none";
      card.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
      card.style.setProperty("--lean", Math.min(1, Math.abs(dx) / 110).toFixed(2));
      card.style.setProperty("--lean-color", dx > 0 ? "var(--good)" : "var(--bad)");
    });
    const release = () => {
      if (x0 === null) return;
      x0 = null;
      if (moved && Math.abs(dx) > Math.min(110, card.offsetWidth * 0.28)) { decide(dx > 0); return; }
      card.style.transition = "";
      card.style.transform = "";
      card.style.removeProperty("--lean");
      setTimeout(() => { moved = false; }, 0);
    };
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);
    card.focus({ preventScroll: true });
  };

  /* quiz */
  const drawQuiz = (enter = false) => {
    const c = deck[i];
    progress();
    const options = shuffle([c, ...shuffle(pool.filter(w => w.word !== c.word)).slice(0, 3)]);
    body.innerHTML = `
      <div class="quiz-step${enter ? " enter" : ""}">
        <p class="eyebrow">Как по-английски</p>
        <p class="study-ask">${esc(c.ru)}</p>
        <div class="card-opts">${options.map(o => `<button type="button" class="opt" lang="en" data-pick="${esc(o.word)}">${esc(o.word)}</button>`).join("")}</div>
        <p class="card-fb" aria-live="polite"></p>
      </div>`;
    body.querySelectorAll("[data-pick]").forEach(btn => btn.addEventListener("click", async () => {
      if (busy) return;
      busy = true;
      const ok = btn.dataset.pick === c.word;
      record(c.word, ok);
      if (ok) right++; else mistakes.push(c);
      body.querySelectorAll("[data-pick]").forEach(x => {
        x.disabled = true;
        if (x.dataset.pick === c.word) x.classList.add("good");
        else if (x === btn) x.classList.add("bad");
      });
      body.querySelector(".card-fb").textContent = ok ? "Верно" : `Правильно: ${c.word}`;
      if (ok) speakEnglish(c.word);
      await wait(ok ? 650 : 1400);
      body.querySelector(".quiz-step")?.classList.add("leave");
      await wait(160);
      i++; busy = false;
      if (i < deck.length) drawQuiz(true); else finish();
    }));
  };

  /* write: see the translation, type the English word */
  const norm = t => t.toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z' -]/g, "").replace(/\s+/g, " ").trim();
  const drawWrite = (enter = false) => {
    const c = deck[i];
    progress();
    body.innerHTML = `
      <form class="quiz-step write-step${enter ? " enter" : ""}" data-write autocomplete="off">
        <p class="eyebrow">Напишите по-английски</p>
        <p class="study-ask">${esc(c.ru)}</p>
        <input class="inp write-inp" type="text" lang="en" aria-label="Слово по-английски" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" data-input>
        <div class="study-choice">
          <button type="button" class="btn quiet" data-giveup>Не помню</button>
          <button type="submit" class="btn ghost" data-check>Проверить</button>
        </div>
        <p class="card-fb" aria-live="polite"></p>
      </form>`;
    const form = body.querySelector("[data-write]"), input = form.querySelector("[data-input]"), fb = form.querySelector(".card-fb");
    input.focus({ preventScroll: true });
    let done = false;
    const next = async () => {
      form.classList.add("leave");
      await wait(160);
      i++; busy = false;
      if (i < deck.length) drawWrite(true); else finish();
    };
    const answer = async (ok, gaveUp = false) => {
      if (done) return;
      done = true; busy = true;
      record(c.word, ok);
      if (ok) right++; else mistakes.push(c);
      input.readOnly = true;
      // «Не помню» shows the word right in the field; a wrong spelling stays there crossed out.
      if (gaveUp) { input.value = c.word; input.classList.add("reveal"); }
      else input.classList.add(ok ? "good" : "bad");
      if (ok) {
        fb.textContent = "Верно";
        speakEnglish(c.word);
        await wait(700);
        next();
        return;
      }
      // A mistake stays on screen until «Дальше»: the right spelling is worth a look.
      if (!gaveUp) input.insertAdjacentHTML("afterend", `<p class="write-answer"><span>Правильно</span><b lang="en">${esc(c.word)}</b></p>`);
      input.blur(); // close the phone keyboard so the answer is not hidden under it
      speakEnglish(c.word);
      const actions = form.querySelector(".study-choice");
      actions.innerHTML = `<button type="submit" class="btn ghost" data-next>Дальше</button>`;
      actions.classList.add("single");
      actions.querySelector("[data-next]").focus({ preventScroll: true });
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (done) { next(); return; }
      if (!norm(input.value)) { input.focus(); return; }
      answer(norm(input.value) === norm(c.word));
    });
    form.querySelector("[data-giveup]").addEventListener("click", () => answer(false, true));
  };

  const wordLine = list => list.map(w => `<li><b lang="en">${esc(w.word)}</b> <span>${esc(w.ru)}</span></li>`).join("");
  const finish = () => {
    flush();
    i = deck.length;
    progress();
    const cards = mode === "cards";
    const weak = cards ? learning : mistakes;
    body.innerHTML = `
      <div class="study-done">
        <p class="eyebrow">${cards ? "Круг пройден" : "Проверка закончена"}</p>
        <p class="portion-score">${cards
          ? `Знаю <b>${known.length}</b> · ещё учу <b>${learning.length}</b>`
          : `<b>${right}</b> из ${deck.length} верно`}</p>
        ${weak.length ? `<div class="study-weak"><p class="hint-line">${cards ? "Стоит повторить" : "Ошибки"}</p><ul>${wordLine(weak)}</ul></div>` : ""}
        <div class="row">
          ${weak.length ? `<button class="btn" type="button" data-weak>Повторить ${weak.length} ${ui.plural(weak.length, "слово", "слова", "слов")}</button>` : ""}
          <button class="btn ${weak.length ? "ghost" : ""}" type="button" data-again>Всё ещё раз</button>
          <button class="btn quiet" type="button" data-done>Закрыть</button>
        </div>
      </div>`;
    body.querySelector("[data-done]").addEventListener("click", close);
    body.querySelector("[data-again]").addEventListener("click", () => restart(shuffle(words)));
    body.querySelector("[data-weak]")?.addEventListener("click", () => restart(shuffle(weak)));
    body.querySelector("[data-weak], [data-again]").focus({ preventScroll: true });
  };

  const restart = list => {
    flush();
    deck = list; i = 0; known = []; learning = []; right = 0; mistakes = []; busy = false;
    stopSpeech();
    mode === "cards" ? drawCard() : mode === "quiz" ? drawQuiz() : drawWrite();
  };
  restart(deck);
}


/* ---------- teacher: words for a student (on the student's page) ---------- */

// Translation from the course dictionary for a word or a short phrase; "" when it is not there.
function lookupRu(text) {
  const parts = text.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  const hit = translate(parts[0], parts.slice(1));
  if (!hit) return "";
  const found = hit.word.split(" → ")[0];
  if (parts.length > 1 && found !== parts.join(" ")) return "";
  return hit.ru;
}

// One line of a pasted list: «kitchen — кухня», «kitchen - кухня», «kitchen: кухня», «kitchen кухня» or just «kitchen».
const LATIN = /^[a-z][a-z' .-]*$/i;
function parseLine(line) {
  const t = line.trim().replace(/^[-•*\d.)\s]+/, "");
  if (!t) return null;
  let word = t, ru = "";
  const sep = t.match(/\s+[—–-]\s+|\s*[—–:=\t]\s*/);
  if (sep) { word = t.slice(0, sep.index); ru = t.slice(sep.index + sep[0].length); }
  else {
    const m = t.match(/^([a-z][a-z' .-]*?)\s+([а-яё].*)$/i);
    if (m) { word = m[1]; ru = m[2]; }
  }
  word = word.trim().toLowerCase().replace(/\s+/g, " ");
  ru = ru.trim();
  if (!LATIN.test(word) || word.length > 60) return { line: t, bad: true };
  const auto = !ru;
  if (auto) ru = lookupRu(word);
  return ru ? { word, ru: ru.slice(0, 200), auto } : { line: t, word, missing: true };
}

// «Слова» tab on a student's page: add words (one by one or a pasted list) and browse the student's dictionary.
// onCount(total) keeps the number on the tab up to date.
export function mountStudentWords(box, userId, onCount = () => {}) {
  let data = { total: 0, learned: 0, items: [] };
  const view = { q: "", filter: "all", shown: 60 };
  box.innerHTML = `
    <section class="card-block sw-block" aria-label="Добавить слова">
      <p class="eyebrow">Добавить слова</p>
      <form class="sw-add" data-sw-form autocomplete="off">
        <label class="visually-hidden" for="sw-word">Слово по-английски</label>
        <input class="inp" id="sw-word" lang="en" placeholder="Слово" autocapitalize="off" spellcheck="false" enterkeyhint="next" maxlength="60" data-sw-word>
        <label class="visually-hidden" for="sw-ru">Перевод</label>
        <input class="inp" id="sw-ru" placeholder="Перевод" enterkeyhint="done" maxlength="200" data-sw-ru>
        <button class="btn" type="submit">Добавить</button>
      </form>
      <p class="sw-hint">Перевод подставляется сам, если слово есть в словаре курса, его можно поправить. Слова сразу появятся у ученика в «Моих словах». <button type="button" class="inline-link" data-sw-bulk-open>Вставить списком</button></p>
      <div class="sw-bulk" data-sw-bulk hidden>
        <label class="sw-bulk-label" for="sw-list">По слову на строку: «kitchen — кухня». Без перевода — подставлю из словаря.</label>
        <textarea class="inp" id="sw-list" rows="6" spellcheck="false" placeholder="kitchen — кухня&#10;look after — присматривать&#10;umbrella" data-sw-text></textarea>
        <p class="sw-parse" aria-live="polite" data-sw-parse></p>
        <div class="acct-actions"><button class="btn" type="button" data-sw-bulk-add disabled>Добавить</button><button class="btn quiet" type="button" data-sw-bulk-close>Отмена</button></div>
      </div>
    </section>
    <section class="card-block sw-block" aria-label="Словарь ученика">
      <p class="eyebrow">Словарь ученика</p>
      <p class="block-note" data-sw-count>Загружаю…</p>
      <div class="words-tools" data-sw-tools hidden>
        <label class="search" for="sw-search">
          <span class="search-ico">${ui.icons.search}</span>
          <input class="inp" id="sw-search" type="search" placeholder="Найти слово или перевод" aria-label="Найти слово или перевод" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" data-sw-search>
        </label>
        <div class="seg" role="tablist" aria-label="Какие слова показать" data-sw-filters></div>
      </div>
      <ul class="words-list sw-list" data-sw-list></ul>
      <p class="empty words-empty" data-sw-empty hidden></p>
      <div class="more-line"><button type="button" class="btn quiet" data-sw-more hidden>Показать ещё</button></div>
    </section>`;
  const $ = sel => box.querySelector(sel);
  const form = $("[data-sw-form]"), wordIn = $("[data-sw-word]"), ruIn = $("[data-sw-ru]");
  const list = $("[data-sw-list]"), more = $("[data-sw-more]"), count = $("[data-sw-count]"), empty = $("[data-sw-empty]");
  const tools = $("[data-sw-tools]"), filters = $("[data-sw-filters]"), search = $("[data-sw-search]");

  const picked = () => {
    const q = view.q.trim().toLowerCase();
    let items = data.items;
    if (view.filter === "due") items = items.filter(isDue).sort((a, b) => new Date(a.due_at) - new Date(b.due_at));
    if (view.filter === "learned") items = items.filter(isLearned);
    if (q) items = items.filter(w => w.word.includes(q) || w.ru.toLowerCase().includes(q));
    if (view.filter !== "due") items = [...items.filter(w => w.from_teacher), ...items.filter(w => !w.from_teacher)];
    return items;
  };
  const draw = (fresh = []) => {
    const due = data.items.filter(isDue).length;
    count.textContent = data.total
      ? `${data.total} ${ui.plural(data.total, "слово", "слова", "слов")} · выучено ${data.learned}${due ? ` · ${due} ждут повторения` : ""}`
      : "Пока пусто. Добавьте первые слова — ученик увидит их в «Моих словах» и сможет тренировать.";
    onCount(data.total);
    tools.hidden = !data.total;
    filters.innerHTML = [["all", "Все", data.total], ["due", "Повторить", due], ["learned", "Выучено", data.learned]].map(([id, name, n]) =>
      `<button type="button" role="tab" aria-selected="${view.filter === id}" data-sw-filter="${id}">${name} <small>${n}</small></button>`).join("");
    const found = picked(), part = found.slice(0, view.shown);
    const grouped = view.filter !== "due";
    let last = "";
    list.innerHTML = part.map(w => {
      const g = grouped ? (w.from_teacher ? "Добавлены учителем, ещё не тренировались" : addedGroup(w)) : "";
      const head = g && g !== last ? `<li class="word-group" aria-hidden="true">${g}</li>` : "";
      last = g;
      const mark = isDue(w) ? `<i class="word-dot"></i>` : isLearned(w) ? `<i class="word-tick">${CHECK_ICON}</i>` : "";
      return head + `<li class="word-row${fresh.includes(w.word) ? " in" : ""}">
        <div class="word-main" title="${wordStatus(w)}"><b lang="en">${esc(w.word)}</b><span>${esc(w.ru)}</span><span class="visually-hidden">, ${wordStatus(w)}</span></div>
        <span class="word-mark" aria-hidden="true">${mark}</span>
        <button type="button" class="icon-btn quiet danger" aria-label="Удалить слово ${esc(w.word)} у ученика" title="Удалить у ученика" data-sw-remove="${esc(w.word)}">${ui.icons.trash}</button>
      </li>`;
    }).join("");
    more.hidden = found.length <= view.shown;
    empty.hidden = !data.total || !!found.length;
    empty.textContent = view.q.trim() ? "Ничего не нашлось." : view.filter === "due" ? "Сейчас повторять нечего." : "Выученных пока нет.";
  };
  const load = async (fresh = []) => {
    try { data = await roles.studentWords(userId); draw(fresh); }
    catch (err) { if (err instanceof AuthRequired) { ui.handleError(err); return; } count.textContent = "Не удалось загрузить слова ученика."; }
  };
  load();

  search.addEventListener("input", () => { view.q = search.value; view.shown = 60; draw(); });
  filters.addEventListener("click", e => {
    const b = e.target.closest("[data-sw-filter]");
    if (!b) return;
    view.filter = b.dataset.swFilter; view.shown = 60; draw();
  });
  more.addEventListener("click", () => { view.shown += 60; draw(); });

  const send = async (items, btn) => {
    btn.disabled = true; btn.classList.add("loading");
    try {
      const r = await roles.addStudentWords(userId, items);
      const parts = [];
      if (r.added) parts.push(`добавлено ${r.added} ${ui.plural(r.added, "слово", "слова", "слов")}`);
      if (r.updated) parts.push(`у ${r.updated} обновлён перевод`);
      if (r.skipped) parts.push(`пропущено ${r.skipped}`);
      ui.toast(parts.length ? parts.join(", ").replace(/^./, c => c.toUpperCase()) : "Ничего не добавлено");
      view.q = ""; search.value = ""; view.filter = "all";
      await load(items.map(x => x.word.trim().toLowerCase()));
      return true;
    } catch (err) {
      if (err instanceof AuthRequired) { ui.handleError(err); return false; }
      ui.toast("Не удалось добавить. Попробуйте ещё раз.");
      return false;
    } finally { btn.disabled = false; btn.classList.remove("loading"); }
  };

  // One by one: the translation fills in from the dictionary while it is untouched; Enter adds and goes back to the word.
  let ruAuto = true;
  wordIn.addEventListener("input", () => { if (ruAuto) ruIn.value = lookupRu(wordIn.value); });
  ruIn.addEventListener("input", () => { ruAuto = !ruIn.value; });
  wordIn.addEventListener("keydown", e => { if (e.key === "Enter" && !ruIn.value.trim()) { e.preventDefault(); ruIn.focus(); } });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const word = wordIn.value.trim().toLowerCase().replace(/\s+/g, " "), ru = ruIn.value.trim();
    if (!LATIN.test(word)) { ui.toast("Введите слово латиницей, например kitchen."); wordIn.focus(); return; }
    if (!ru) { ruIn.focus(); return; }
    if (await send([{ word, ru }], form.querySelector("[type=submit]"))) {
      wordIn.value = ""; ruIn.value = ""; ruAuto = true;
      wordIn.focus();
    }
  });

  // A pasted list: parsed as you type, with a short summary of what will be added and what is skipped.
  const bulk = $("[data-sw-bulk]"), text = $("[data-sw-text]"), parseOut = $("[data-sw-parse]"), bulkAdd = $("[data-sw-bulk-add]");
  let parsed = [];
  const reparse = () => {
    const rows = text.value.split(/\r?\n/).map(parseLine).filter(Boolean);
    const seen = new Set();
    parsed = rows.filter(r => r.ru && !seen.has(r.word) && seen.add(r.word)).slice(0, 200);
    const missing = rows.filter(r => r.missing).map(r => r.word), bad = rows.filter(r => r.bad).map(r => r.line);
    const lines = [];
    if (parsed.length) lines.push(`Готово к добавлению: <b>${parsed.length}</b> ${ui.plural(parsed.length, "слово", "слова", "слов")}${parsed.some(r => r.auto) ? `, перевод из словаря у ${parsed.filter(r => r.auto).length}` : ""}.`);
    if (missing.length) lines.push(`Нет перевода, допишите через тире: ${missing.map(esc).join(", ")}.`);
    if (bad.length) lines.push(`Не похоже на английское слово: ${bad.slice(0, 5).map(esc).join(", ")}${bad.length > 5 ? "…" : ""}.`);
    parseOut.innerHTML = lines.map(l => `<span>${l}</span>`).join("");
    bulkAdd.disabled = !parsed.length;
    bulkAdd.textContent = parsed.length ? `Добавить ${parsed.length} ${ui.plural(parsed.length, "слово", "слова", "слов")}` : "Добавить";
  };
  text.addEventListener("input", reparse);
  $("[data-sw-bulk-open]").addEventListener("click", () => { bulk.hidden = false; text.focus(); });
  $("[data-sw-bulk-close]").addEventListener("click", () => { bulk.hidden = true; });
  bulkAdd.addEventListener("click", async () => {
    if (!parsed.length) return;
    if (await send(parsed.map(({ word, ru }) => ({ word, ru })), bulkAdd)) { text.value = ""; reparse(); bulk.hidden = true; }
  });

  list.addEventListener("click", async e => {
    const del = e.target.closest("[data-sw-remove]");
    if (!del) return;
    const li = del.closest("li"), word = del.dataset.swRemove;
    del.disabled = true;
    try {
      await roles.removeStudentWord(userId, word);
      const gone = () => {
        const w = data.items.find(x => x.word === word);
        data = { ...data, total: data.total - 1, learned: data.learned - (w && isLearned(w) ? 1 : 0), items: data.items.filter(x => x.word !== word) };
        draw();
      };
      if (ui.reduced()) gone(); else { li.style.height = li.offsetHeight + "px"; li.classList.add("leaving"); setTimeout(gone, 260); }
      ui.toast(`Слово «${word}» удалено у ученика`);
    } catch (err) {
      if (err instanceof AuthRequired) { ui.handleError(err); return; }
      del.disabled = false;
      ui.toast("Не удалось удалить. Попробуйте ещё раз.");
    }
  });
}

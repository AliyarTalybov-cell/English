// Lesson trainer: theory + exercises with error diagnosis and a "my mistakes" review.
// Lesson content comes from the database; progress is saved through the `save` callbacks.
import { canSpeak, speakQueue, speakEnglish, stopSpeech, pauseSpeech, resumeSpeech, onPlayerChange, theoryQueue, languageRuns, getRate, setRate, listVoices, voiceId, currentVoice, setVoice } from "./speech.js";
import { translate } from "./translate.js";

const EXP = {"i'm":"i am","you're":"you are","we're":"we are","they're":"they are","he's":"he is","she's":"she is","it's":"it is","what's":"what is","where's":"where is","who's":"who is","how's":"how is","when's":"when is","that's":"that is","isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"were not","don't":"do not","doesn't":"does not","haven't":"have not","hasn't":"has not","i've":"i have","you've":"you have","we've":"we have","they've":"they have","didn't":"did not","couldn't":"could not","won't":"will not","let's":"let us","there's":"there is","can't":"can not","cannot":"can not","i'd":"i would"};
const norm = s => s.toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.?!,;:]/g, " ").replace(/\s+/g, " ").trim().split(" ").map(w => EXP[w] || w).join(" ");
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- listening ---------- */
const SHARE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
const SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="wave1" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="wave2" d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

// Small round button that speaks one English phrase.
export function sayButton(text, label = "Послушать") {
  const b = document.createElement("button");
  b.type = "button"; b.className = "say"; b.setAttribute("aria-label", label); b.innerHTML = SPEAKER;
  b.addEventListener("click", e => {
    e.stopPropagation();
    if (b.classList.contains("playing")) { stopSpeech(); return; }
    b.classList.add("playing");
    speakEnglish(text, { onStop: () => b.classList.remove("playing") });
  });
  return b;
}

// English-only text of a node: drops Russian runs, struck-out wrong variants and buttons.
function englishOf(node) {
  const copy = node.cloneNode(true);
  copy.querySelectorAll(".no, button").forEach(n => n.remove());
  return languageRuns(copy.textContent).filter(r => r.lang === "en").map(r => r.text).join(". ");
}

const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z"/></svg>';
const CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

// When the student scrolls during playback, stop following the highlighted text for a while.
let lastUserScroll = 0;
const noteUserScroll = () => { lastUserScroll = Date.now(); };
["wheel", "touchmove", "keydown"].forEach(ev => addEventListener(ev, noteUserScroll, { passive: true }));

// Floating mini-player: pause / resume / stop without scrolling back to the topic.
let playerEl = null;
function ensurePlayer() {
  if (playerEl) return;
  playerEl = document.createElement("div");
  playerEl.className = "player";
  playerEl.setAttribute("role", "region");
  playerEl.setAttribute("aria-label", "Озвучка");
  playerEl.innerHTML = `<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <span class="player-label"></span>
    <button type="button" class="player-btn" data-player="toggle" aria-label="Пауза">${PAUSE}</button>
    <button type="button" class="player-btn" data-player="stop" aria-label="Остановить">${CLOSE}</button>`;
  document.body.appendChild(playerEl);
  const label = playerEl.querySelector(".player-label"), toggle = playerEl.querySelector('[data-player="toggle"]');
  toggle.addEventListener("click", () => (playerEl.classList.contains("paused") ? resumeSpeech() : pauseSpeech()));
  playerEl.querySelector('[data-player="stop"]').addEventListener("click", () => stopSpeech());
  onPlayerChange(({ status, label: text }) => {
    const show = status !== "idle" && !!text;
    playerEl.classList.toggle("show", show);
    playerEl.classList.toggle("paused", status === "paused");
    if (!show) return;
    label.textContent = text;
    toggle.innerHTML = status === "paused" ? PLAY : PAUSE;
    toggle.setAttribute("aria-label", status === "paused" ? "Продолжить" : "Пауза");
  });
}

// Voice picker: a bottom sheet with English and Russian voices, each with a preview.
const ACCENTS = { "en-gb": "британский", "en-us": "американский", "en-au": "австралийский", "en-ie": "ирландский", "en-za": "южноафриканский", "en-in": "индийский", "en-ca": "канадский", "en-nz": "новозеландский", "ru-ru": "русский" };
const SLIDERS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>';
const SAMPLES = { en: "Hi! I've got a new phone. Nice to meet you.", ru: "Привет! Так звучит этот голос." };
let sheetEl = null;
function openVoiceSheet(opener) {
  if (!sheetEl) {
    sheetEl = document.createElement("div");
    sheetEl.className = "sheet-backdrop";
    sheetEl.hidden = true;
    sheetEl.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="voice-title">
      <div class="sheet-head"><h2 id="voice-title">Голос озвучки</h2><button type="button" class="player-btn sheet-close" aria-label="Закрыть">${CLOSE}</button></div>
      <section class="voice-group"><h3>Скорость</h3>
        <div class="seg" role="radiogroup" aria-label="Скорость озвучки">
          <button type="button" role="radio" data-rate="normal">Обычная</button>
          <button type="button" role="radio" data-rate="slow">Медленная</button>
        </div>
      </section>
      <p class="sheet-note sheet-voices-note">Голоса берутся из вашего устройства, поэтому на телефоне и компьютере список разный. Нажмите ▶, чтобы послушать.</p>
      <div data-voices></div>
    </div>`;
    document.body.appendChild(sheetEl);
    const close = () => {
      stopSpeech();
      sheetEl.classList.remove("open");
      setTimeout(() => { sheetEl.hidden = true; }, reducedMotion() ? 0 : 220);
      sheetEl._opener?.focus();
    };
    sheetEl._close = close;
    sheetEl.addEventListener("click", e => { if (e.target === sheetEl) close(); });
    sheetEl.querySelector(".sheet-close").addEventListener("click", close);
    addEventListener("keydown", e => { if (e.key === "Escape" && !sheetEl.hidden) close(); });
    sheetEl.querySelectorAll("[data-rate]").forEach(b => b.addEventListener("click", () => {
      setRate(b.dataset.rate);
      showRates();
      speakQueue([{ lang: "en", text: SAMPLES.en }]);
    }));
  }
  function showRates() {
    sheetEl.querySelectorAll("[data-rate]").forEach(b => b.setAttribute("aria-checked", String(b.dataset.rate === getRate())));
  }
  showRates();
  const box = sheetEl.querySelector("[data-voices]");
  const render = () => {
    box.innerHTML = "";
    for (const [lang, title] of [["en", "Английский"], ["ru", "Русский"]]) {
      const list = listVoices(lang);
      const section = document.createElement("section");
      section.className = "voice-group";
      section.innerHTML = `<h3>${title}</h3>`;
      if (!list.length) section.insertAdjacentHTML("beforeend", `<p class="sheet-note">На этом устройстве нет голосов для этого языка.</p>`);
      const chosen = currentVoice(lang);
      for (const v of list) {
        const row = document.createElement("div");
        row.className = "voice-row" + (chosen && voiceId(chosen) === voiceId(v) ? " selected" : "");
        const name = v.name.replace(/\s*\(.*\)\s*$/, "");
        const meta = [ACCENTS[v.lang.toLowerCase().replace("_", "-")] || v.lang, v.localService ? "" : "онлайн"].filter(Boolean).join(" · ");
        row.innerHTML = `<button type="button" class="voice-pick" role="radio" aria-checked="${row.classList.contains("selected")}">
            <span class="voice-dot" aria-hidden="true"></span><span class="voice-name">${esc(name)}</span><span class="voice-meta">${esc(meta)}</span>
          </button>
          <button type="button" class="say voice-try" aria-label="Послушать голос ${esc(name)}">${PLAY}</button>`;
        row.querySelector(".voice-pick").addEventListener("click", () => {
          setVoice(lang, voiceId(v));
          render();
          speakQueue([{ lang, text: SAMPLES[lang] }]);
        });
        const tryBtn = row.querySelector(".voice-try");
        tryBtn.addEventListener("click", () => {
          if (tryBtn.classList.contains("playing")) { stopSpeech(); return; }
          speakQueue([{ lang, text: SAMPLES[lang], voice: v }], { onStop: () => tryBtn.classList.remove("playing") });
          tryBtn.classList.add("playing");
        });
        section.appendChild(row);
      }
      box.appendChild(section);
    }
  };
  render();
  sheetEl._opener = opener;
  sheetEl.hidden = false;
  requestAnimationFrame(() => sheetEl.classList.add("open"));
  sheetEl.querySelector(".voice-row.selected .voice-pick, .voice-pick, .sheet-close")?.focus({ preventScroll: true });
}

// "Слушать тему" and "Примеры" pills + speed switch for a topic's theory.
function listenControls(theory, topicName) {
  ensurePlayer();
  const wrap = document.createElement("div");
  wrap.className = "listen-wrap";
  const pill = (mode, label) => `<button class="listen" type="button" aria-pressed="false" data-listen="${mode}">
      <span class="listen-icon">${SPEAKER}</span>
      <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="listen-text">${label}</span>
    </button>`;
  // Examples mode reads only the English sentences, one after another — for repeating aloud.
  const exampleEls = [...theory.querySelectorAll(".examples li, .compare > div")].filter(li => englishOf(li.querySelector(".en") || li));
  // Reading texts get their own button: the English paragraphs one after another.
  const readingEls = [...theory.querySelectorAll(".reading p")].filter(el => englishOf(el));
  // With a reading text there are three pills, so the labels get shorter to keep them on one line.
  const short = readingEls.length > 0;
  wrap.innerHTML = (short ? pill("reading", "Текст") : "") + pill("topic", short ? "Тема" : "Слушать тему") + (exampleEls.length > 1 ? pill("examples", "Примеры") : "") +
    `<button class="voice-btn" type="button" aria-haspopup="dialog" aria-label="Голос и скорость озвучки">${SLIDERS}</button>`;
  wrap.querySelector(".voice-btn").addEventListener("click", e => openVoiceSheet(e.currentTarget));
  let current = null;
  const mark = el => {
    if (current === el) return;
    current?.classList.remove("speaking");
    current = el;
    if (!el) return;
    el.classList.add("speaking");
    const r = el.getBoundingClientRect();
    if (Date.now() - lastUserScroll > 6000 && (r.top < 90 || r.bottom > innerHeight - 90)) el.scrollIntoView({ block: "center", behavior: smooth() });
  };
  wrap.querySelectorAll("[data-listen]").forEach(btn => {
    const label = btn.querySelector(".listen-text").textContent;
    const setText = t => { btn.querySelector(".listen-text").textContent = t; };
    let unsubscribe = null;
    const idle = () => { unsubscribe?.(); unsubscribe = null; mark(null); btn.classList.remove("playing", "paused"); btn.setAttribute("aria-pressed", "false"); setText(label); };
    btn.addEventListener("click", () => {
      if (btn.classList.contains("paused")) { resumeSpeech(); return; }
      if (btn.classList.contains("playing")) { stopSpeech(); return; }
      const mode = btn.dataset.listen;
      const parts = mode === "examples"
        ? exampleEls.map(el => ({ lang: "en", text: englishOf(el.querySelector(".en") || el), el }))
        : mode === "reading"
          ? readingEls.map(el => ({ lang: "en", text: englishOf(el), el }))
          : theoryQueue(theory);
      if (!parts.length) return;
      const what = mode === "examples" ? "Примеры" : mode === "reading" ? "Текст" : "Тема";
      speakQueue(parts, { onPart: mark, onStop: idle, label: `${what} · ${topicName}` });
      btn.classList.add("playing"); btn.setAttribute("aria-pressed", "true");
      unsubscribe = onPlayerChange(({ status }) => {
        if (status === "idle") return;
        btn.classList.toggle("paused", status === "paused");
        setText(status === "paused" ? "Продолжить" : "Стоп");
      });
    });
  });
  return wrap;
}
const smooth = () => reducedMotion() ? "auto" : "smooth";
const EASE = "cubic-bezier(.16,1,.3,1)";

// Set feedback content; open it smoothly by height when it was empty, cross-fade otherwise.
function setFeedback(fb, className, html, animate = true) {
  const wasEmpty = !fb.innerHTML;
  const from = fb.getBoundingClientRect().height;
  fb.className = className;
  fb.innerHTML = html;
  if (!animate || reducedMotion() || !fb.animate) return;
  const to = fb.getBoundingClientRect().height;
  if (wasEmpty) fb.animate([{ height: "0px", opacity: 0 }, { height: to + "px", opacity: 1 }], { duration: 260, easing: EASE });
  else if (Math.abs(to - from) > 1) fb.animate([{ height: from + "px", opacity: .6 }, { height: to + "px", opacity: 1 }], { duration: 220, easing: EASE });
  else fb.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
}

// FLIP: animate elements from their old positions to the new ones after a DOM change.
function flip(elements, mutate) {
  if (reducedMotion() || !Element.prototype.animate) { mutate(); return; }
  const first = new Map(elements.map(el => [el, el.getBoundingClientRect()]));
  mutate();
  elements.forEach(el => {
    const a = first.get(el), b = el.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 260, easing: EASE });
  });
}

/* ---------- error explanations ---------- */
const NEED = "Поставьте эту фразу на место подлежащего и спросите себя: это I, один (he / she / it) или несколько (we / you / they)?";
function whyNotBe(opt, a) {
  const o = String(opt).toLowerCase(), ans = String(a).toLowerCase();
  const one = "Подлежащее здесь одно (he / she / it)?", many = "Подлежащее здесь — несколько, или you / we / they?";
  const M = {
    "am": "am ставится только с I, а подлежащее здесь не I.",
    "am not": "am not ставится только с I, а подлежащее здесь не I.",
    "is": ans.startsWith("am") ? "С I нельзя is, только am." : `is — для одного человека или предмета. ${one}`,
    "isn't": ans.startsWith("am") ? "С I нельзя isn't, только am not." : `isn't — для одного человека или предмета. ${one}`,
    "are": ans.startsWith("am") ? "С I нельзя are, только am." : `are — для нескольких и для you / we / they. ${many}`,
    "aren't": ans.startsWith("am") ? "С I нельзя aren't, только am not." : `aren't — для нескольких и для you / we / they. ${many}`,
    "was": ans.startsWith("were") ? `was — для одного (I / he / she / it). ${many}` : "was — это прошлое. Есть ли в предложении yesterday, ago, last…?",
    "were": ans.startsWith("was") ? `were — для нескольких и для you / we / they. ${one}` : "were — это прошлое. Есть ли в предложении yesterday, ago, last…?",
    "wasn't": "wasn't — для одного (I / he / she / it).",
    "weren't": ans.startsWith("wasn't") ? `weren't — для нескольких и для you / we / they. ${one}` : "weren't — это прошлое, а здесь at the moment, то есть «сейчас».",
    "—": "Без am / is / are здесь нет сказуемого: в предложении нет глагола-действия.",
    "not": "Одного not мало: нужен глагол to be + not (isn't / aren't)."
  };
  if (ans === "—" && ["am", "is", "are"].includes(o)) return "В предложении уже есть глагол-действие. Второй глагол am / is / are рядом с ним не ставим.";
  if (ans === "was" && (o === "is" || o === "are")) return "Смотрите на слово yesterday: действие было в прошлом.";
  return M[o] || null;
}

function diagnose(it, v, tries) {
  const raw = v.toLowerCase().replace(/[’‘`´]/g, "'");
  if (/\bamn't\b/.test(raw)) return "Формы amn't не существует. Правильно: I'm not / I am not.";
  if (it.a.length <= 2 && !it.a[0].includes(" ")) return it.h || "Проверьте написание.";
  const u = norm(v).split(" "), e = norm(it.a[0]).split(" ");
  const BE = ["am", "is", "are", "was", "were"];
  const noArt = arr => arr.filter(w => !["a", "an", "the"].includes(w)).join(" ");
  if (it.a.some(a => noArt(norm(a).split(" ")) === noArt(u))) {
    return e.includes("an") && !u.includes("an") ? "Почти! Перед гласным звуком нужен артикль an: an engineer."
      : e.some(w => ["doctor", "teacher", "nurse", "student", "engineer", "pilot", "singer", "writer", "musician", "photographer"].includes(w))
        ? "Почти! Проверьте артикли a / the. Перед профессией в единственном числе ставим a: a doctor."
        : "Почти! Проверьте артикли: перед одним предметом, который можно посчитать, нужен a / an, перед уже известным — the.";
  }
  if ([...u].sort().join(" ") === [...e].sort().join(" ")) {
    if (BE.includes(e[0])) return "Все слова верные, но порядок другой. В вопросе am / is / are стоит перед подлежащим.";
    if (["where", "what", "when", "who", "how", "why"].includes(e[0])) return e.includes("do") || e.includes("does") || e.includes("did")
      ? "Все слова верные, но порядок другой. После вопросительного слова идёт do / does / did, потом кто и действие. Предлог — в конце."
      : "Все слова верные, но порядок другой. После вопросительного слова сразу идёт am / is / are, потом подлежащее. Предлог — в конце.";
    if (["do", "does", "did", "have", "has", "can"].includes(e[0])) return "Все слова верные, но порядок другой. В вопросе вспомогательный глагол стоит в самом начале, перед тем, кто действует.";
    return e.some(w => BE.includes(w))
      ? "Все слова верные, но порядок другой. Порядок: кто + am / is / are + остальное."
      : "Все слова верные, но порядок другой. Порядок: кто → действие → что → где → когда.";
  }
  if ((u.includes("my") || u.includes("our")) && e.includes("your")) return "Вы спрашиваете собеседника, поэтому my / our меняем на your.";
  const eb = e.find(w => BE.includes(w)), ub = u.filter(w => BE.includes(w));
  if (eb && !ub.length) return "Пропущен глагол to be (am / is / are). Без него предложение неполное.";
  if (eb && !ub.includes(eb)) return `Форма глагола не та: у вас «${ub[0]}». ${whyNotBe(ub[0], eb) || NEED}`;
  if (e.includes("not") && !u.includes("not")) return "Не хватает отрицания: not, isn't или aren't.";
  if (!e.includes("not") && u.includes("not")) return "Здесь отрицание не нужно.";
  if (e.includes("from") && !u.includes("from")) return "Не хватает from — «откуда». Оно стоит в конце вопроса.";
  if (e.includes("in") && !u.includes("in")) return "Не хватает предлога in.";
  if (e.includes("it") && !u.includes("it")) return "Пропущено подлежащее it.";
  const word = wordDiff(it, u);
  if (word) return word;
  if (tries >= 1 && e[0] !== u[0]) return `Подсказка: предложение начинается с «${cap(it.a[0].split(" ")[0])}».`;
  return "Сравните с формулой в объяснении темы. Проверьте каждое слово.";
}

// Word-by-word comparison with the closest accepted answer: names the kind of mistake without giving the answer away.
const AGREE = [["have", "has"], ["do", "does"], ["is", "are"], ["am", "is"], ["am", "are"], ["was", "were"]];
function wordDist(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function wordDiff(it, u) {
  const best = it.a.map(a => norm(a).split(" ")).sort((x, y) => wordDist(u, x) - wordDist(u, y))[0];
  const missing = best.filter(w => !u.includes(w)), extra = u.filter(w => !best.includes(w));
  if (!missing.length && !extra.length) return "";
  const pair = extra.find(x => missing.some(m => AGREE.some(([p, q]) => (p === x && q === m) || (q === x && p === m))
    || x + "s" === m || m + "s" === x || x + "es" === m || m + "es" === x));
  if (pair) return `Форма «${pair}» не подходит к тому, кто действует. I / you / we / they — have, do, are и глагол без -s; he / she / it — has, does, is и глагол с -s.`;
  if (!extra.length && missing.length === 1 && ["a", "an", "the"].includes(missing[0])) return "Почти! Не хватает артикля a / an / the.";
  if (!extra.length && missing.some(w => ["do", "does", "did"].includes(w))) return "Не хватает вспомогательного глагола do / does / did: в вопросе и отрицании без него нельзя.";
  if (!extra.length) return missing.length === 1 ? "Почти! Не хватает одного слова." : `Не хватает нескольких слов (${missing.length}).`;
  if (!missing.length) return extra.length === 1 ? `Лишнее слово: «${extra[0]}».` : `Лишние слова: «${extra.join("», «")}».`;
  if (missing.length === 1 && extra.length === 1) return `Почти! Одно слово не то: «${extra[0]}».`;
  return "";
}

// «Как строится»: the word order of the sentence type, shown next to a wrong typed or assembled answer.
const WH_WORDS = ["where", "what", "when", "who", "how", "why", "which", "whose"];
const AUX_WORDS = ["am", "is", "are", "was", "were", "do", "does", "did", "have", "has", "can"];
function orderSchema(answer) {
  const first = answer.replace(/[.?!,]/g, "").split(" ")[0].toLowerCase();
  const q = /\?\s*$/.test(answer);
  if (q && WH_WORDS.includes(first)) return { note: "Вопрос: вопросительное слово, за ним вспомогательный глагол, потом кто.", slots: ["где · что · когда…", "!do · does · is · did…", "кто", "действие", "остальное"] };
  if (q && AUX_WORDS.includes(first)) return { note: "Вопрос «да / нет» начинается со вспомогательного глагола.", slots: ["!Do · Does · Is · Can…", "кто", "действие", "остальное"] };
  if (/n't\b|\bnot\b/i.test(answer)) return { note: "Отрицание стоит сразу после того, кто действует.", slots: ["кто", "!don't · isn't · can't…", "действие", "что · где · когда"] };
  return { note: "В английском порядок строгий: сначала кто, потом действие, потом остальное.", slots: ["кто", "!действие", "что · кого", "где", "когда"] };
}
const slotsHtml = slots => `<div class="formula">${slots.map((x, i) =>
  (i ? '<span class="plus">+</span>' : "") + `<span class="slot${x.startsWith("!") ? " be" : ""}">${esc(x.replace(/^!/, ""))}</span>`).join("")}</div>`;
function whyAside(it, topicFormula) {
  const box = document.createElement("aside");
  box.className = "why";
  const { note, slots } = orderSchema(it.a[0]);
  box.innerHTML = `
    <p class="why-head">Как строится</p>
    ${topicFormula ? `<div class="why-part"><p class="why-label">Формула темы</p>${topicFormula}</div>` : ""}
    <div class="why-part"><p class="why-label">Порядок слов</p>${slotsHtml(slots)}<p class="why-note">${note}</p></div>`;
  return box;
}

function orderHint(it, tries) {
  const words = it.a[0].replace(/[.?!]$/, "").split(" ");
  const isQ = it.a[0].endsWith("?");
  if (tries === 1) return isQ
    ? (["Is", "Are", "Am"].includes(words[0]) ? "Это вопрос «да / нет»: am / is / are стоит в самом начале." : "Это вопрос: вопросительное слово → am / is / are → подлежащее → остальное. Предлог — в конце.")
    : "Порядок: кто / что → что делает (или am / is / are) → кого / что → где → когда.";
  if (tries === 2) return `Подсказка: предложение начинается с «${words[0]}».`;
  return `Подсказка: начало — «${words.slice(0, Math.min(3, words.length - 1)).join(" ")} …».`;
}

const answerText = it => it.t === "choice" ? it.a
  : it.t === "fix" ? it.q.split(" ").map((w, i) => i === it.w ? it.c + ((w.match(/[.?!]$/) || [""])[0]) : w).join(" ")
  : it.a[0];

function qHtml(it) {
  if (!it.q) return it.t === "order" ? '<span class="q-hint">Расставьте слова по порядку</span>' : "";
  const q = esc(it.q);
  return q.includes("___") ? q.replace("___", '<span class="blank">&nbsp;</span>') : q;
}

// The finished English sentence of a task, for listening after it is solved. Null when there is nothing English to say.
function spokenAnswer(it) {
  const filled = it.t === "choice" && it.q.includes("___") ? it.q.replace("___", it.a === "—" ? "" : it.a) : answerText(it);
  if (/^(true|false)$/i.test(String(filled).trim())) return null;
  const text = languageRuns(String(filled).replace(/\([^)]*\)/g, "")).filter(r => r.lang === "en").map(r => r.text).join(" ");
  return /[A-Za-z]/.test(text) && text.replace(/[^A-Za-z]/g, "").length > 1 ? text : null;
}

/* ---------- dictation: listen and type ---------- */
// Sentences for a dictation are the finished English sentences of the topic's own tasks,
// so nothing new has to be written: the student hears what they have just practised.
function dictationSentences(sec, limit = 6) {
  const seen = new Set(), out = [];
  sec.groups.forEach(g => g.items.forEach(it => {
    const text = spokenAnswer(it);
    if (!text) return;
    const words = text.trim().split(/\s+/).length;
    if (words < 3 || words > 10) return; // too short to hear, too long to hold in the head
    const key = norm(text);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ text, ru: it.ru || "" });
  }));
  // A different set every time, but stable inside one round.
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out.slice(0, limit);
}

function dictationPanel(sec) {
  const list = dictationSentences(sec);
  const box = document.createElement("div");
  box.className = "dictation";
  if (!list.length) return null;
  let i = 0, right = 0, tries = 0;

  const draw = () => {
    const cur = list[i];
    box.innerHTML = `
      <div class="dict-head">
        <p class="eyebrow">Диктант · ${i + 1} из ${list.length}</p>
        <button type="button" class="btn quiet dict-close" data-close>Закрыть</button>
      </div>
      <p class="block-note">Послушайте и запишите предложение. Знаки препинания и заглавные буквы не важны.</p>
      <div class="dict-play"><button type="button" class="btn ghost" data-play>▶ Послушать</button><button type="button" class="btn quiet" data-slow>Медленнее</button></div>
      <label class="field" for="dict-input"><span>Что вы услышали</span>
        <input class="inp" id="dict-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Например: She is a teacher">
      </label>
      <div class="row"><button class="btn" type="button" data-check>Проверить</button><button class="btn ghost" type="button" data-show>Показать ответ</button></div>
      <div class="fb" aria-live="polite"></div>`;
    const inp = box.querySelector("#dict-input"), fb = box.querySelector(".fb");
    // «Медленнее» reads this sentence well below the chosen speed; the setting itself stays as it is.
    const play = slower => speakEnglish(cur.text, { slower });
    box.querySelector("[data-play]").addEventListener("click", () => play(false));
    box.querySelector("[data-slow]").addEventListener("click", () => play(true));
    const next = () => {
      i++; tries = 0;
      if (i < list.length) { draw(); setTimeout(() => box.querySelector("[data-play]")?.click(), 250); }
      else done();
    };
    const reveal = (ok) => {
      if (ok) right++;
      setFeedback(fb, "fb " + (ok ? "good" : "shown"),
        `<span class="head">${ok ? "Верно!" : "Правильный ответ:"}</span><span class="ans">${esc(cur.text)}</span>${cur.ru ? `<span>${esc(cur.ru)}</span>` : ""}`);
      box.querySelectorAll("button, input").forEach(b => { if (!b.dataset.close) b.disabled = true; });
      const go = document.createElement("button");
      go.type = "button"; go.className = "btn"; go.textContent = i + 1 < list.length ? "Дальше" : "Итог";
      go.addEventListener("click", next);
      fb.appendChild(go);
      go.focus({ preventScroll: true });
    };
    const check = () => {
      const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      if (norm(v) === norm(cur.text)) { reveal(true); return; }
      tries++;
      if (tries === 1) setFeedback(fb, "fb bad", `<span class="head">Пока не так.</span><span>Послушайте ещё раз, можно медленнее. Проверьте порядок слов.</span>`);
      else reveal(false);
    };
    box.querySelector("[data-check]").addEventListener("click", check);
    box.querySelector("[data-show]").addEventListener("click", () => reveal(false));
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    box.querySelector("[data-close]").addEventListener("click", () => { stopSpeech(); box.remove(); });
  };

  const done = () => {
    stopSpeech();
    box.innerHTML = `
      <div class="dict-head"><p class="eyebrow">Диктант пройден</p></div>
      <p class="portion-score"><b>${right}</b> из ${list.length} на слух</p>
      <p class="block-note">${right === list.length ? "Отлично слышите эту тему." : "Нормальный результат: аудирование подтягивается повторами. Попробуйте ещё раз завтра."}</p>
      <div class="row"><button class="btn" type="button" data-again>Ещё раз</button><button class="btn quiet" type="button" data-close>Закрыть</button></div>`;
    box.querySelector("[data-again]").addEventListener("click", () => { const fresh = dictationPanel(sec); box.replaceWith(fresh); fresh.scrollIntoView({ block: "center", behavior: smooth() }); });
    box.querySelector("[data-close]").addEventListener("click", () => box.remove());
  };

  draw();
  return box;
}

/* ---------- «Диалог на слух» at the end of a topic's practice ---------- */
// Listen first and translate in your head; the text and the line-by-line translation open only when needed.
function listenBlock({ scene, lines }, onClose) {
  // In «По ролям» the student takes the part of whoever answers first.
  const me = (lines.find(([who]) => who !== lines[0][0]) || lines[0])[0];
  const box = document.createElement("div");
  box.className = "topic-text";
  box.innerHTML = `
    <div class="tt-head">
      <div class="tt-head-text">
        <p class="recall-head">Диалог на слух · послушайте и переведите про себя</p>
        <p class="tt-scene">${esc(scene)}</p>
      </div>
      ${onClose ? `<button type="button" class="btn quiet tt-close" data-tt-close>Закрыть</button>` : ""}
    </div>
    ${canSpeak() ? `<div class="row"><button class="btn ghost" type="button" data-tt-play>▶ Послушать</button><button class="btn quiet" type="button" data-tt-slow>Медленнее</button><button class="btn quiet" type="button" data-tt-role>По ролям</button></div>
    <p class="tt-role">Вы — ${esc(me)}. Ваши реплики отмечены: скажите их вслух в паузе.</p>` : ""}
    <details class="tt-more"${canSpeak() ? "" : " open"}>
      <summary class="tt-link">Показать текст</summary>
      <ol class="tt-lines">${lines.map(([who, en, ru]) =>
        `<li><span class="tt-who">${esc(who)}</span><span class="tt-say"><span class="tt-en">${esc(en)}</span><span class="tt-ru">${esc(ru)}</span></span></li>`).join("")}</ol>
      <button type="button" class="tt-link" data-tt-ru aria-expanded="false">Показать перевод</button>
    </details>`;
  box.querySelector("[data-tt-close]")?.addEventListener("click", onClose);
  const more = box.querySelector(".tt-more"), sum = more.querySelector("summary");
  more.addEventListener("toggle", () => { sum.textContent = more.open ? "Скрыть текст" : "Показать текст"; });
  const ruBtn = box.querySelector("[data-tt-ru]");
  ruBtn.addEventListener("click", () => {
    const on = box.classList.toggle("with-ru");
    ruBtn.textContent = on ? "Скрыть перевод" : "Показать перевод";
    ruBtn.setAttribute("aria-expanded", on);
  });
  const play = box.querySelector("[data-tt-play]"), slow = box.querySelector("[data-tt-slow]"), role = box.querySelector("[data-tt-role]");
  if (play) {
    const items = [...box.querySelectorAll(".tt-lines li")];
    items.forEach((li, i) => li.classList.toggle("mine", lines[i][0] === me));
    const mark = el => items.forEach(li => li.classList.toggle("now", li === el));
    const idle = () => { play.textContent = "▶ Послушать"; box.classList.remove("playing", "role"); mark(null); };
    // Own lines become pauses long enough to say them: about half a second per word, never under two seconds.
    const pauseFor = en => Math.max(2000, 900 + en.split(/\s+/).length * 550);
    const start = (slower, asRole) => {
      stopSpeech(); // the previous queue reports its stop now, not after this one has started
      box.classList.add("playing"); box.classList.toggle("role", asRole); play.textContent = "■ Стоп";
      if (asRole) more.open = true;
      speakQueue(lines.map(([who, en], i) => asRole && who === me ? { pause: pauseFor(en), el: items[i] } : { lang: "en", text: en, el: items[i] }),
        { slower, onPart: mark, onStop: idle });
    };
    play.addEventListener("click", () => box.classList.contains("playing") ? stopSpeech() : start(false, false));
    slow.addEventListener("click", () => start(true, false));
    role.addEventListener("click", () => start(false, true));
  }
  return box;
}

/* ---------- tap a word for a translation ---------- */
// Every English word in the explanation is tappable; exercises stay untouched so nothing is given away.
const BOOKMARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 4.5h11a1 1 0 0 1 1 1v14l-6.5-4-6.5 4v-14a1 1 0 0 1 1-1z"/></svg>';
const BOOKMARK_ON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 4.5h11a1 1 0 0 1 1 1v14l-6.5-4-6.5 4v-14a1 1 0 0 1 1-1z"/></svg>';
let wordPop = null;
// Set by the app: saves a word to «Мои слова». Without it the popup shows no save button.
let wordSaver = null;
export function setWordSaver(fn) { wordSaver = fn; }
function hideWordPop() { wordPop?.classList.remove("show"); }

function showWordPop(target, hit) {
  if (!wordPop) {
    wordPop = document.createElement("div");
    wordPop.className = "word-pop";
    wordPop.innerHTML = `<button type="button" class="word-say" aria-label="Послушать">${SPEAKER}</button>
      <div><p class="word-en"></p><p class="word-ru"></p></div>
      <button type="button" class="word-add" aria-label="Сохранить в мои слова" title="Сохранить в мои слова" hidden>${BOOKMARK}</button>`;
    document.body.appendChild(wordPop);
    wordPop.addEventListener("click", e => e.stopPropagation());
    wordPop.querySelector(".word-say").addEventListener("click", () => speakEnglish(wordPop.dataset.word || ""));
    wordPop.querySelector(".word-add").addEventListener("click", async e => {
      const btn = e.currentTarget;
      if (!wordSaver || btn.disabled) return;
      btn.disabled = true;
      try {
        await wordSaver(wordPop.dataset.word || "", wordPop.dataset.ru || "");
        btn.innerHTML = BOOKMARK_ON; btn.classList.add("added");
        btn.title = "Слово сохранено"; btn.setAttribute("aria-label", "Слово сохранено");
      } catch { btn.disabled = false; }
    });
    addEventListener("scroll", hideWordPop, { passive: true });
    addEventListener("resize", hideWordPop);
    document.addEventListener("click", hideWordPop);
  }
  wordPop.dataset.word = hit.word.split(" → ")[0];
  wordPop.dataset.ru = hit.ru;
  wordPop.querySelector(".word-en").textContent = hit.word;
  wordPop.querySelector(".word-ru").textContent = hit.ru;
  const add = wordPop.querySelector(".word-add");
  // Any word or phrase can be saved, «these» and «from» included.
  add.hidden = !wordSaver;
  add.disabled = false; add.innerHTML = BOOKMARK; add.classList.remove("added");
  add.title = "Сохранить в мои слова"; add.setAttribute("aria-label", "Сохранить в мои слова");
  wordPop.classList.add("show");
  const r = target.getBoundingClientRect(), w = wordPop.getBoundingClientRect();
  if (!r.width && !r.height) return;
  const left = Math.min(Math.max(8, r.left + r.width / 2 - w.width / 2), innerWidth - w.width - 8);
  const above = r.top > w.height + 16;
  wordPop.style.left = left + "px";
  wordPop.style.top = (above ? r.top - w.height - 8 : r.bottom + 8) + "px";
  wordPop.classList.toggle("below", !above);
}

// Слово определяется по точке нажатия — текст не переразмечается, поэтому большие уроки не тормозят.
const WORD = /[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’-]*/g;

function wordAt(node, offset) {
  const text = node.nodeValue || "";
  for (const m of text.matchAll(WORD)) {
    if (offset >= m.index && offset <= m.index + m[0].length && m[0].length > 1) {
      return { word: m[0], start: m.index, end: m.index + m[0].length };
    }
  }
  return null;
}

function caretFrom(x, y) {
  if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    return pos && pos.offsetNode ? { node: pos.offsetNode, offset: pos.offset } : null;
  }
  const range = document.caretRangeFromPoint?.(x, y);
  return range ? { node: range.startContainer, offset: range.startOffset } : null;
}

// Следующие слова нужны для фраз вроде «get up» и «a lot of».
function wordsAfter(node, end, limit = 2) {
  const out = [];
  let text = (node.nodeValue || "").slice(end);
  let cur = node;
  while (out.length < limit) {
    for (const m of text.matchAll(WORD)) { out.push(m[0]); if (out.length >= limit) break; }
    if (out.length >= limit) break;
    const walker = document.createTreeWalker(cur.getRootNode(), NodeFilter.SHOW_TEXT);
    walker.currentNode = cur;
    const next = walker.nextNode();
    if (!next) break;
    cur = next; text = next.nodeValue || "";
  }
  return out;
}

function enableTapTranslate(root) {
  root.addEventListener("click", e => {
    if (e.target.closest("button, a, input, .listen-wrap")) return;
    const caret = caretFrom(e.clientX, e.clientY);
    if (!caret || caret.node.nodeType !== 3) { hideWordPop(); return; }
    const found = wordAt(caret.node, caret.offset);
    if (!found) { hideWordPop(); return; }
    const hit = translate(found.word, wordsAfter(caret.node, found.end));
    if (!hit) { hideWordPop(); return; }
    e.stopPropagation();
    const range = document.createRange();
    range.setStart(caret.node, found.start);
    range.setEnd(caret.node, found.end);
    showWordPop(range, hit);
  });
}

/* ---------- lesson ---------- */
// progress: { itemId: { status: 'ok'|'retry'|'shown', fixed: bool } }
// save: { status(id, status), fixed(id), reset(sectionId) } — each returns a promise
const PORTION = 12;
const plural = (n, one, few, many) => {
  const t = Math.abs(n) % 100, d = t % 10;
  if (t > 10 && t < 20) return many;
  if (d > 1 && d < 5) return few;
  return d === 1 ? one : many;
};

export function mountLesson(root, lesson, progress, save, opts = {}) {
  const S = lesson.content.sections;
  const INDEX = {};
  S.forEach(sec => sec.groups.forEach((g, gi) => g.items.forEach((it, ii) => { INDEX[`${sec.id}-${gi}-${ii}`] = it; })));
  const mistakes = () => Object.keys(INDEX).filter(id => progress[id] && progress[id].status !== "ok" && !progress[id].fixed);

  root.innerHTML = `
    <nav class="nav" aria-label="Темы урока">
      <div class="nav-inner">
        <div class="chips" data-chips></div>
        <div class="bar" aria-hidden="true"><i data-bar></i></div>
      </div>
    </nav>
    <main class="wrap">
      <header class="hero">
        <div class="hero-top">
          <a class="back" href="#/">← Все уроки</a>
          ${opts.share ? `<button type="button" class="share-btn" data-share>${SHARE_ICON}<span>Поделиться</span></button>` : ""}
        </div>
        <h1>${esc(lesson.title)}</h1>
        ${lesson.subtitle ? `<p class="lead">${esc(lesson.subtitle)}</p>` : ""}
        <p class="tap-tip">Нажмите на любое английское слово — покажем перевод.</p>
        ${Object.keys(progress).length || lesson.content.steps === false ? "" : `<ol class="steps">
          <li><b>1</b>Прочитайте объяснение темы</li>
          <li><b>2</b>Посмотрите разобранные примеры</li>
          <li><b>3</b>Решайте: проверка сразу, с пояснением</li>
        </ol>
        <p class="muted" style="font-size:14px">Прогресс сохраняется автоматически и одинаков на всех устройствах.</p>`}
      </header>
      <div data-topics></div>
      <section class="topic" id="review">
        <header><p class="eyebrow">Работа над ошибками</p><h2>Повторить мои ошибки</h2></header>
        <p class="muted">Сюда попадают задания, решённые не с первой попытки или с подсмотренным ответом. Они перемешиваются. Задание уходит из списка, когда вы решите его здесь с первого раза.</p>
        <div class="review-box">
          <div class="big" data-rev-count>0</div>
          <p data-rev-text>заданий с ошибками</p>
          <div class="row"><button class="btn" type="button" data-rev-start>Собрать задания</button></div>
        </div>
        <ol class="items" data-rev-list></ol>
      </section>
      <section class="finish">
        <p class="eyebrow">Итог</p>
        <div class="score" data-score>0 / 0</div>
        <p class="muted" data-score-text></p>
      </section>
    </main>`;
  root.querySelector("[data-share]")?.addEventListener("click", () => opts.share());

  // Portions call these back when an answer is saved, to know when a portion is finished.
  const answerHooks = [];
  // Every third task answered right from the first try asks to write the whole sentence:
  // choosing from three buttons is easier than recalling the words yourself.
  let recallPool = [];
  const $ = sel => root.querySelector(sel);
  // Tap-to-translate works across the whole lesson: explanation, tasks, feedback and «Мои ошибки».
  enableTapTranslate($("main.wrap"));
  const topics = $("[data-topics]");

  let activeId = S[0]?.id;
  const chipsEl = () => $("[data-chips]");
  function markActive() {
    const chips = chipsEl();
    chips.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.target === activeId));
    const a = chips.querySelector(".chip.active");
    if (a) {
      // Keep the active chip fully visible, away from the faded edges: centre it when it drifts out.
      const pos = a.offsetLeft - chips.offsetLeft;
      if (pos < chips.scrollLeft + 28 || pos + a.offsetWidth > chips.scrollLeft + chips.clientWidth - 36) {
        chips.scrollTo({ left: Math.max(0, pos - (chips.clientWidth - a.offsetWidth) / 2), behavior: smooth() });
      }
    }
  }
  function updateFade() {
    const c = chipsEl();
    c.classList.toggle("scrolled", c.scrollLeft > 4);
    c.classList.toggle("at-end", c.scrollLeft + c.clientWidth >= c.scrollWidth - 4);
  }
  function updateProgress() {
    let allDone = 0, allTotal = 0, allOk = 0;
    const chips = chipsEl();
    const keepScroll = chips.scrollLeft;
    chips.innerHTML = "";
    const addChip = (label, count, cls, targetId) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip" + cls; b.dataset.target = targetId;
      b.innerHTML = `${esc(label)} <small>${count}</small>`;
      b.addEventListener("click", () => document.getElementById(targetId)?.scrollIntoView({ behavior: smooth() }));
      chips.appendChild(b);
    };
    S.forEach(sec => {
      let total = 0, done = 0, ok = 0;
      sec.groups.forEach((g, gi) => g.items.forEach((_, ii) => {
        total++; const p = progress[`${sec.id}-${gi}-${ii}`];
        if (p) done++; if (p && p.status === "ok") ok++;
      }));
      allDone += done; allTotal += total; allOk += ok;
      addChip(sec.nav, `${done}/${total}`, done === total ? " complete" : "", sec.id);
      const secEl = document.getElementById(sec.id);
      if (secEl) secEl.querySelector("[data-count]").innerHTML = `<span>сделано ${done} из ${total}</span> · <span>с первой попытки ${ok}</span>`;
    });
    const mist = mistakes().length;
    addChip("Мои ошибки", mist, mist ? " mist" : "", "review");
    chips.style.scrollBehavior = "auto";
    chips.scrollLeft = keepScroll;
    chips.style.scrollBehavior = "";
    markActive(); updateFade();
    const rc = $("[data-rev-count]");
    rc.textContent = mist; rc.classList.toggle("zero", !mist);
    $("[data-rev-text]").textContent = mist ? "заданий ждут повторения" : (allDone ? "ошибок нет, всё исправлено" : "ошибок пока нет");
    $("[data-rev-start]").disabled = !mist;
    $("[data-bar]").style.width = (allTotal ? allDone / allTotal * 100 : 0) + "%";
    $("[data-score]").textContent = `${allOk} / ${allTotal}`;
    $("[data-score-text]").textContent = allDone === allTotal
      ? "Все задания пройдены. Число выше — сколько решено с первой попытки. Темы с ошибками можно начать заново."
      : `Решено с первой попытки. Всего сделано ${allDone} из ${allTotal}.`;
  }

  function renderSection(sec) {
    const el = document.createElement("section");
    el.className = "topic"; el.id = sec.id;
    el.innerHTML = `
      <header>
        <p class="eyebrow">${esc(sec.eyebrow)}${sec.hard ? ' <span class="hard">сложнее</span>' : ""}</p>
        <h2>${esc(sec.title)}</h2>
      </header>
      <button class="to-practice" type="button" data-to-practice>К практике ↓</button>
      <div class="theory">${sec.theory}</div>
      <div class="practice">
        <div class="practice-head">
          <h3>Практика</h3>
          <div class="ph-right"><span class="count" data-count></span><button class="btn quiet" type="button" data-reset>Начать заново</button></div>
        </div>
      </div>`;
    const pr = el.querySelector(".practice");
    // Practice comes in portions of ~12 tasks: a finishable piece of work instead of an endless page.
    const flat = [];
    sec.groups.forEach((g, gi) => g.items.forEach((it, ii) => flat.push({ it, id: `${sec.id}-${gi}-${ii}`, group: g.title })));
    const parts = [];
    for (let i = 0; i < flat.length; i += PORTION) parts.push(flat.slice(i, i + PORTION));
    // Start where the work stopped last time.
    const firstUnsolved = parts.findIndex(part => part.some(x => !progress[x.id]));
    let pi = firstUnsolved < 0 ? parts.length - 1 : firstUnsolved;
    const holder = document.createElement("div");
    pr.appendChild(holder);
    const solvedHere = flat.filter(x => progress[x.id]).length;
    // «Проверьте себя»: in a topic not started yet, four tasks from different groups before the explanation.
    // They run in review mode, so nothing is written to progress.
    if (!solvedHere) {
      const pool = sec.groups.map((g, gi) => ({ g, gi })).filter(({ g }) => g.title !== "Переведите с русского");
      const picks = pool.slice(0, 4).map(({ g, gi }) => ({ it: g.items[0], id: `${sec.id}-${gi}-0` }));
      if (picks.length >= 3) {
        const line = document.createElement("p");
        line.className = "precheck-line";
        line.innerHTML = `Уже знаете эту тему? <button type="button" class="text-link">Проверьте себя: ${picks.length} ${plural(picks.length, "задание", "задания", "заданий")}</button>`;
        line.querySelector("button").addEventListener("click", () => {
          const box = document.createElement("div");
          box.className = "precheck";
          box.innerHTML = `<div class="precheck-head"><p class="eyebrow">Проверьте себя</p><button type="button" class="btn quiet tt-close" data-close>Скрыть</button></div><ol class="items"></ol><p class="precheck-result" aria-live="polite"></p>`;
          const list = box.querySelector(".items"), result = box.querySelector(".precheck-result");
          const got = [];
          picks.forEach(x => list.appendChild(renderItem(x.it, x.id, true, status => {
            got.push(status);
            if (got.length < picks.length) return;
            const ok = got.filter(v => v === "ok").length;
            result.innerHTML = ok === picks.length
              ? `${ok} из ${picks.length} с первой попытки. Тема знакома — можно сразу к практике. <button type="button" class="text-link" data-go>К практике ↓</button>`
              : `${ok} из ${picks.length} с первой попытки. Начните с объяснения ниже — оно короткое.`;
            result.querySelector("[data-go]")?.addEventListener("click", () => pr.scrollIntoView({ block: "start", behavior: smooth() }));
          })));
          box.querySelector("[data-close]").addEventListener("click", () => box.replaceWith(line));
          line.replaceWith(box);
        });
        el.querySelector(".theory").before(line);
      }
    }
    const showOpener = () => {
      holder.innerHTML = "";
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "btn open-practice";
      btn.textContent = solvedHere
        ? `${solvedHere === flat.length ? "Открыть" : "Продолжить"} практику · решено ${solvedHere} из ${flat.length}`
        : `Начать практику · ${flat.length} ${plural(flat.length, "задание", "задания", "заданий")}`;
      btn.addEventListener("click", () => renderPart(false));
      holder.appendChild(btn);
    };

    let startedAt = 0;
    const renderPart = (scrollTo = false) => {
      const part = parts[pi] || [];
      startedAt = 0;
      holder.innerHTML = "";
      const box = document.createElement("div");
      box.className = "portion";
      if (parts.length > 1) box.innerHTML = `<p class="portion-head">Часть ${pi + 1} из ${parts.length} · ${part.length} ${plural(part.length, "задание", "задания", "заданий")}</p>`;
      let lastGroup = null, list = null;
      part.forEach(x => {
        if (x.group !== lastGroup) {
          lastGroup = x.group;
          const gEl = document.createElement("div");
          gEl.className = "group";
          gEl.innerHTML = `<h4>${esc(x.group)}</h4><ol class="items"></ol>`;
          box.appendChild(gEl);
          list = gEl.querySelector(".items");
        }
        list.appendChild(renderItem(x.it, x.id));
      });
      const result = document.createElement("div");
      result.className = "portion-done";
      result.hidden = true;
      box.appendChild(result);
      holder.appendChild(box);
      if (scrollTo) box.scrollIntoView({ block: "start", behavior: smooth() });

      const showResult = () => {
        const done = part.filter(x => progress[x.id]).length;
        const ok = part.filter(x => progress[x.id]?.status === "ok").length;
        const mins = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 0;
        const more = pi + 1 < parts.length;
        const nextSec = S[S.indexOf(sec) + 1];
        result.innerHTML = `
          <p class="eyebrow">Часть ${pi + 1} из ${parts.length} пройдена</p>
          <p class="portion-score"><b>${ok}</b> из ${done} с первой попытки</p>
          <p class="muted">${mins ? `Примерно ${mins} ${plural(mins, "минута", "минуты", "минут")}.` : ""}${ok === done ? "" : " Ошибки ждут в «Моих ошибках»."}</p>
          <div class="row">
            ${more ? `<button class="btn" type="button" data-next-part>Следующая часть</button>`
                   : nextSec ? `<button class="btn" type="button" data-next-topic>Следующая тема: ${esc(nextSec.nav)}</button>`
                             : `<button class="btn" type="button" data-go-review>Повторить мои ошибки</button>`}
            <a class="btn quiet" href="#/">Закончить занятие</a>
          </div>`;
        // A couple of sentences to write out from memory, right after the score.
        recallPool.slice(-1).forEach(r => askToWrite(result, r.sentence, r.cue));
        recallPool = [];
        if (!more && sec.listen) result.querySelector(":scope > .row").before(listenBlock(sec.listen));
        result.hidden = false;
        // The topic goes into the repetition queue; a clean portion pushes the next date further away.
        opts.onPortionDone?.(sec.id, ok === done);
        result.querySelector("[data-next-part]")?.addEventListener("click", () => { pi++; renderPart(true); });
        result.querySelector("[data-next-topic]")?.addEventListener("click", () => document.getElementById(nextSec.id)?.scrollIntoView({ block: "start", behavior: smooth() }));
        result.querySelector("[data-go-review]")?.addEventListener("click", () => document.getElementById("review")?.scrollIntoView({ block: "start", behavior: smooth() }));
      };
      if (part.every(x => progress[x.id])) showResult();
      answerHooks.push(id => {
        if (!part.some(x => x.id === id)) return;
        if (!startedAt) startedAt = Date.now();
        if (box.isConnected && part.every(x => progress[x.id])) showResult();
      });
    };
    if (sec.id === openId) renderPart();
    else showOpener();
    const idx = S.indexOf(sec);
    const next = S[idx + 1];
    const nextBtn = document.createElement("button");
    nextBtn.type = "button"; nextBtn.className = "next-topic";
    nextBtn.innerHTML = next
      ? `<span><small>Следующая тема</small><b>${esc(next.nav)}</b></span><span class="arr" aria-hidden="true">→</span>`
      : `<span><small>Дальше</small><b>Повторить мои ошибки</b></span><span class="arr" aria-hidden="true">→</span>`;
    nextBtn.addEventListener("click", () => document.getElementById(next ? next.id : "review")?.scrollIntoView({ block: "start", behavior: smooth() }));
    el.appendChild(nextBtn);
    el.querySelector("[data-to-practice]").addEventListener("click", () => pr.scrollIntoView({ block: "start", behavior: smooth() }));
    if (canSpeak()) {
      const theory = el.querySelector(".theory");
      const toPractice = el.querySelector("[data-to-practice]");
      const actions = document.createElement("div");
      actions.className = "topic-actions";
      toPractice.replaceWith(actions);
      actions.append(listenControls(theory, sec.nav), toPractice);
      if (dictationSentences(sec, 1).length) {
        const dictBtn = document.createElement("button");
        dictBtn.type = "button"; dictBtn.className = "to-practice dict-open";
        dictBtn.textContent = "Диктант на слух";
        dictBtn.addEventListener("click", () => {
          el.querySelector(".dictation")?.remove();
          const panel = dictationPanel(sec);
          if (!panel) return;
          dictBtn.after(panel);
          panel.scrollIntoView({ block: "center", behavior: smooth() });
          setTimeout(() => panel.querySelector("[data-play]")?.click(), 300);
        });
        actions.append(dictBtn);
      }
      // The same dialogue as at the end of the practice, available at any time.
      if (sec.listen) {
        const dlgBtn = document.createElement("button");
        dlgBtn.type = "button"; dlgBtn.className = "to-practice dict-open";
        dlgBtn.textContent = "Диалог на слух";
        dlgBtn.setAttribute("aria-expanded", "false");
        const close = () => { stopSpeech(); el.querySelector(".topic-text.standalone")?.remove(); dlgBtn.setAttribute("aria-expanded", "false"); };
        dlgBtn.addEventListener("click", () => {
          if (el.querySelector(".topic-text.standalone")) { close(); return; }
          const panel = listenBlock(sec.listen, close);
          panel.classList.add("standalone");
          actions.after(panel);
          dlgBtn.setAttribute("aria-expanded", "true");
          panel.scrollIntoView({ block: "nearest", behavior: smooth() });
        });
        actions.append(dlgBtn);
      }
      theory.querySelectorAll(".reading p").forEach(par => {
        const text = englishOf(par);
        if (!text) return;
        par.classList.add("has-say");
        par.append(sayButton(text, "Послушать абзац"));
      });
      theory.querySelectorAll(".examples li, .compare > div").forEach(li => {
        const text = englishOf(li.querySelector(".en") || li);
        if (!text) return;
        li.classList.add("has-say");
        li.append(sayButton(text));
      });
    }
    el.querySelector("[data-reset]").addEventListener("click", () => {
      Object.keys(progress).forEach(k => { if (k.startsWith(sec.id + "-")) delete progress[k]; });
      save.reset(sec.id);
      const fresh = renderSection(sec);
      el.replaceWith(fresh);
      observer.observe(fresh);
      updateProgress();
    });
    return el;
  }

  // «Закрепим»: at the end of a portion, write out in full a sentence whose gap you just filled; the gapped task is shown as the cue.
  function askToWrite(host, sentence, cue) {
    const box = document.createElement("div");
    box.className = "recall";
    box.innerHTML = `
      <p class="recall-head">Закрепим: напишите предложение целиком</p>
      <p class="recall-cue">${cue}</p>
      <div class="row">
        <input class="inp" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Напишите по-английски" aria-label="Напишите предложение целиком">
        <button class="btn" type="button" data-recall-check>Проверить</button>
        <button class="btn quiet" type="button" data-recall-skip>Пропустить</button>
      </div>
      <p class="recall-fb" aria-live="polite"></p>`;
    // above the buttons: write the sentence first, then move on
    const row = host.querySelector(":scope > .row");
    if (row) row.before(box); else host.appendChild(box);
    const inp = box.querySelector("input"), fb = box.querySelector(".recall-fb");
    let tries = 0;
    const finishRecall = ok => {
      box.classList.add(ok ? "ok" : "shown");
      fb.innerHTML = ok
        ? `<b>Верно!</b> Теперь это предложение вы вспомните и без подсказок.`
        : `Правильно так: <b>${esc(sentence)}</b>`;
      box.querySelectorAll("input, button").forEach(b => b.disabled = true);
    };
    const check = () => {
      const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      if (norm(v) === norm(sentence)) { finishRecall(true); return; }
      tries++;
      if (tries === 1) fb.textContent = "Почти. Проверьте порядок слов и форму глагола, попробуйте ещё раз.";
      else finishRecall(false);
    };
    box.querySelector("[data-recall-check]").addEventListener("click", check);
    box.querySelector("[data-recall-skip]").addEventListener("click", () => box.remove());
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); check(); } });
  }

  // The first formula of a topic's explanation, reused next to wrong answers.
  const formulaCache = {};
  const topicFormula = id => {
    const secId = id.replace(/-\d+-\d+$/, "");
    if (!(secId in formulaCache)) {
      const tpl = document.createElement("template");
      tpl.innerHTML = S.find(x => x.id === secId)?.theory || "";
      formulaCache[secId] = tpl.content.querySelector(".formula")?.outerHTML || "";
    }
    return formulaCache[secId];
  };

  function renderItem(it, id, review, onDone) {
    const li = document.createElement("li");
    li.className = "item"; li.id = review ? "rev-" + id : id;
    const domId = li.id;
    const hint = it.p ? `<span class="hint">${esc(it.p)}</span>` : "";
    let body;
    if (it.t === "fix") {
      const words = it.q.split(" ").map((w, i) => `<button type="button" class="w" data-i="${i}">${esc(w)}</button>`).join(" ");
      body = `<div class="q"><div class="qt">${words}${hint}</div></div>
        <div class="row"><button class="btn ghost" type="button" data-show>Показать ответ</button></div>`;
    } else {
      body = `<div class="q"><div class="qt">${qHtml(it)}${hint}</div></div>`;
      if (it.t === "choice") {
        body += `<div class="opts">${it.o.map(o => `<button type="button" class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
      } else if (it.t === "input") {
        body += `<div class="row"><input class="inp" id="in-${domId}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Ваш ответ" aria-label="Ваш ответ">
          <button class="btn" type="button" data-check>Проверить</button><button class="btn quiet" type="button" data-hint>Подсказка</button><button class="btn ghost" type="button" data-show>Ответ</button></div>`;
      } else if (it.t === "order") {
        body += `<div class="line" data-line></div><div class="bank" data-bank>${it.w.map((w, i) => `<button type="button" class="tile" data-k="${i}">${esc(w)}</button>`).join("")}</div>
          <div class="row"><button class="btn" type="button" data-check>Проверить</button><button class="btn quiet" type="button" data-clear>Очистить</button><button class="btn ghost" type="button" data-show>Ответ</button></div>`;
      }
    }
    li.innerHTML = body + `<div class="fb" aria-live="polite"></div>`;
    const st = { tries: 0 };
    const fb = li.querySelector(".fb");

    // Save; on failure keep a small retry mark on the task until the save goes through.
    const persist = send => Promise.resolve(send()).then(ok => {
      li.querySelector(".unsaved")?.remove();
      if (ok !== false) return;
      const mark = document.createElement("button");
      mark.type = "button"; mark.className = "unsaved";
      mark.textContent = "Ответ не сохранился · Повторить";
      mark.addEventListener("click", () => { mark.disabled = true; mark.textContent = "Сохраняю…"; persist(send); });
      li.appendChild(mark);
    });
    const finish = (status, silent) => {
      if (!silent) onDone?.(status);
      if (review) {
        if (status === "ok" && progress[id]) { progress[id].fixed = true; persist(() => save.fixed(id)); updateProgress(); }
      } else if (!silent) {
        progress[id] = { status, fixed: false }; persist(() => save.status(id, status)); updateProgress();
        answerHooks.forEach(h => h(id));
      }
      if (!silent && status !== "shown") li.classList.add("just-ok");
      li.classList.add("done"); if (status !== "shown") li.classList.add("ok");
      const blank = li.querySelector(".blank");
      if (blank && it.t === "choice") { if (it.a === "—") blank.remove(); else { blank.textContent = it.a; blank.classList.add("filled"); } }
      li.querySelectorAll("button, input").forEach(b => b.disabled = true);
      if (it.t === "choice") li.querySelectorAll(".opt").forEach(b => { if (b.dataset.o === it.a) b.classList.add("good"); });
      if (it.t === "fix") {
        const wb = li.querySelector(`.w[data-i="${it.w}"]`);
        const orig = it.q.split(" ")[it.w], punct = (orig.match(/[.?!]$/) || [""])[0];
        wb.classList.remove("bad"); wb.classList.add("fixed");
        wb.innerHTML = `<s>${esc(orig.replace(/[.?!]$/, ""))}</s>${esc(it.c)}${punct}`;
      }
      const head = status === "ok" ? "Верно!" : status === "retry" ? "Верно, со второй попытки." : "Правильный ответ:";
      const showAns = it.t !== "choice" || !it.q.includes("___");
      setFeedback(fb, "fb " + (status === "shown" ? "shown" : "good"),
        `<span class="head">${head}</span>${showAns ? `<span class="ans">${esc(answerText(it))}</span>` : ""}<span>${esc(it.ex || "")}</span>`, !silent);
      const spoken = spokenAnswer(it);
      if (spoken && canSpeak()) fb.querySelector(".head").append(sayButton(spoken, "Послушать ответ"));
      if (!review && !silent && status === "ok" && it.t === "choice" && it.q.includes("___") && spoken && spoken.trim().split(/\s+/).length >= 3) {
        recallPool.push({ sentence: spoken, cue: qHtml(it) }); // asked at the end of the portion, not in the middle of it
      }
    };
    const wrong = msg => {
      st.tries++;
      setFeedback(fb, "fb bad", `<span class="head">Пока не так.</span><span>${esc(msg)}</span>${st.tries >= 2 && it.t !== "order" ? '<span class="tip">Если не получается, нажмите «Ответ» и прочитайте пояснение. Задание попадёт в «Мои ошибки».</span>' : ""}`);
      // Written and assembled sentences get «Как строится» once: on a wide screen to the right, on a phone below.
      if ((it.t === "input" && it.a[0].includes(" ")) || it.t === "order") {
        if (!li.querySelector(".why")) {
          const why = whyAside(it, topicFormula(id));
          // The card spans the task rows plus one flexible row, so its height never stretches the task itself.
          const rows = li.children.length;
          li.style.setProperty("--why-rows", `repeat(${rows}, auto) 1fr`);
          why.style.gridRow = `1 / span ${rows + 1}`;
          li.appendChild(why);
          li.classList.add("has-why");
        }
      }
    };

    if (it.t === "choice") {
      li.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        if (b.dataset.o === it.a) finish(st.tries ? "retry" : "ok");
        else { b.classList.add("bad"); b.disabled = true; wrong((it.b && it.b[b.dataset.o]) || whyNotBe(b.dataset.o, it.a) || "Этот вариант не подходит. Попробуйте другой."); }
      }));
    }
    if (it.t === "input") {
      const inp = li.querySelector("input");
      const check = () => {
        const v = inp.value;
        if (!v.trim()) { inp.focus(); return; }
        if (it.a.some(a => norm(a) === norm(v))) finish(st.tries ? "retry" : "ok");
        else wrong(diagnose(it, v, st.tries));
      };
      li.querySelector("[data-check]").addEventListener("click", check);
      // Подсказка не считается ошибкой: сначала первое слово, потом начало фразы.
      let hintStep = 0;
      li.querySelector("[data-hint]").addEventListener("click", () => {
        const words = it.a[0].split(" ");
        hintStep = Math.min(hintStep + 1, 2);
        const part = hintStep === 1 ? words.slice(0, 1) : words.slice(0, Math.max(2, Math.ceil(words.length / 2)));
        const tail = part.length < words.length ? " …" : "";
        setFeedback(fb, "fb shown", `<span class="head">Подсказка</span><span class="ans">${esc(part.join(" "))}${tail}</span>${hintStep === 1 && words.length > 1 ? '<span class="tip">Нажмите ещё раз, чтобы увидеть больше.</span>' : ""}`);
        inp.focus({ preventScroll: true });
      });
      inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
      li.querySelector("[data-show]").addEventListener("click", () => { inp.value = it.a[0]; finish("shown"); });
    }
    if (it.t === "order") {
      const line = li.querySelector("[data-line]"), bank = li.querySelector("[data-bank]");
      li.addEventListener("click", e => {
        const t = e.target.closest(".tile"); if (!t || t.disabled || li.classList.contains("done")) return;
        const tiles = [...li.querySelectorAll(".tile")];
        flip(tiles, () => (t.parentElement === bank ? line : bank).appendChild(t));
        if (fb.classList.contains("bad")) { fb.className = "fb"; fb.innerHTML = ""; }
      });
      li.querySelector("[data-clear]").addEventListener("click", () => {
        flip([...li.querySelectorAll(".tile")], () => {
          [...line.children].forEach(t => bank.appendChild(t));
          [...bank.children].sort((a, b) => a.dataset.k - b.dataset.k).forEach(t => bank.appendChild(t));
        });
      });
      li.querySelector("[data-check]").addEventListener("click", () => {
        if (bank.children.length) { wrong("Используйте все слова."); st.tries--; return; }
        const v = [...line.children].map(t => t.textContent).join(" ");
        if (it.a.some(a => norm(a) === norm(v))) finish(st.tries ? "retry" : "ok");
        else wrong(orderHint(it, st.tries + 1));
      });
      li.querySelector("[data-show]").addEventListener("click", () => finish("shown"));
    }
    if (it.t === "fix") {
      li.querySelectorAll(".w").forEach(b => b.addEventListener("click", () => {
        if (+b.dataset.i === it.w) finish(st.tries ? "retry" : "ok");
        else { b.classList.add("bad"); b.disabled = true; wrong(`«${b.textContent.replace(/[.?!]$/, "")}» здесь стоит правильно. Проверьте, подходит ли каждое слово к подлежащему.`); }
      }));
      li.querySelector("[data-show]").addEventListener("click", () => finish("shown"));
    }

    if (!review && progress[id]) {
      if (it.t === "order") {
        const line = li.querySelector("[data-line]");
        it.a[0].replace(/[.?!]$/, "").split(" ").forEach(w => { const s = document.createElement("span"); s.className = "tile"; s.textContent = w; line.appendChild(s); });
        li.querySelector("[data-bank]").remove();
      }
      if (it.t === "input") li.querySelector("input").value = it.a[0];
      finish(progress[id].status, true);
    }
    return li;
  }

  $("[data-rev-start]").addEventListener("click", () => {
    const ids = mistakes();
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    const list = $("[data-rev-list]");
    list.innerHTML = "";
    ids.forEach(id => list.appendChild(renderItem(INDEX[id], id, true)));
    $("[data-rev-text]").textContent = `Собрано ${ids.length}. Решите их ниже.`;
    list.scrollIntoView({ block: "start" });
  });

  // Only the topic being worked on keeps its tasks on screen; the others offer «Начать практику»,
  // so the page is one topic long instead of two hundred tasks.
  const openId = (opts.revealFrom && S.some(x => x.id === opts.revealFrom))
    ? opts.revealFrom
    : (S.find(sec => sec.groups.some((g, gi) => g.items.some((_, ii) => !progress[`${sec.id}-${gi}-${ii}`]))) || S[0])?.id;

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible && visible.target.id !== activeId) { activeId = visible.target.id; markActive(); }
  }, { rootMargin: "-90px 0px -60% 0px" });

  S.forEach(sec => topics.appendChild(renderSection(sec)));
  updateProgress();
  root.querySelectorAll(".topic").forEach(t => observer.observe(t));

  // Soft reveal for topics that start below the fold (content stays readable at rest).
  if (!reducedMotion() && !opts.revealFrom && "IntersectionObserver" in window) {
    const revealer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    root.querySelectorAll(".topic").forEach(t => {
      if (t.getBoundingClientRect().top > innerHeight) { t.classList.add("reveal"); revealer.observe(t); }
    });
  }
  chipsEl().addEventListener("scroll", updateFade, { passive: true });
  addEventListener("resize", updateFade);

  const toTop = document.createElement("button");
  toTop.type = "button"; toTop.className = "to-top"; toTop.tabIndex = -1; toTop.setAttribute("aria-hidden", "true");
  toTop.setAttribute("aria-label", "Наверх"); toTop.textContent = "↑";
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: smooth() }));
  document.body.appendChild(toTop);
  const onScroll = () => {
    if (!toTop.isConnected) { removeEventListener("scroll", onScroll); return; }
    const show = scrollY >= 900;
    if (show !== toTop.classList.contains("show")) {
      toTop.classList.toggle("show", show);
      toTop.tabIndex = show ? 0 : -1;
      toTop.setAttribute("aria-hidden", String(!show));
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
}

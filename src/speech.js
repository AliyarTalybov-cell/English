// Read lesson text aloud with the device's built-in voices (Web Speech API).
// Russian and English parts are spoken with matching voices; one queue plays at a time.

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
const RATE_KEY = "english-speech-rate";
const RATES = { en: { normal: 0.92, slow: 0.7 }, ru: { normal: 1.05, slow: 0.9 } };

export const canSpeak = () => !!synth && typeof SpeechSynthesisUtterance !== "undefined";
export const voiceNames = () => ({ en: voices.en?.name || null, ru: voices.ru?.name || null });

export function getRate() {
  try { return localStorage.getItem(RATE_KEY) === "slow" ? "slow" : "normal"; } catch { return "normal"; }
}
export function setRate(rate) {
  try { localStorage.setItem(RATE_KEY, rate); } catch {}
}

// Voices load asynchronously in Chrome; pick the best available per language once they arrive.
let voices = { en: null, ru: null };
const VOICE_KEY = { en: "english-voice-en", ru: "english-voice-ru" };
// Natural-sounding voices first. macOS in Russian shows localized names (Дэниэл, Саманта), so both spellings are listed.
const RANK = {
  en: [/premium|enhanced|улучшенн|премиум/i, /^(daniel|дэниэл)/i, /^(kate|кейт)/i, /^(serena|серена)/i, /^(arthur|артур)/i, /^(martha|марта)/i,
    /microsoft (libby|sonia|ryan|maisie)/i, /^(samantha|саманта)/i, /^(moira|мойра)/i, /^(karen|карен)/i, /^(tessa|тесса)/i,
    /microsoft (aria|jenny|guy)/i, /google uk english male/i, /google us english/i, /google uk english female/i],
  ru: [/premium|enhanced|улучшенн|премиум/i, /^(milena|милена)/i, /google русский/i, /microsoft (svetlana|dariya|dmitry)/i, /^(yuri|юрий)/i, /^(katya|катя)/i],
};
// Novelty and robotic macOS voices are never offered.
const NOVELTY = /^(eddy|эдди|flo|фло|grandma|бабушка|grandpa|дедушка|reed|рид|rocko|рокко|sandy|сэнди|shelley|шелли|albert|альберт|bad news|плохие новости|bahh|бах|bells|колокольчик|boing|прыг-скок|bubbles|пузырьки|cellos|виолончель|good news|хорошие новости|jester|шутник|organ|орган|superstar|суперзвезда|trinoids|триноид|whisper|шепот|шёпот|wobble|воббл|zarvox|зарвокс|junior|джуниор|ralph|ральф|fred|фред|kathy|кэти)(\s|\(|$)/i;

const readStored = lang => { try { return localStorage.getItem(VOICE_KEY[lang]); } catch { return null; } };
const rankOf = (lang, v) => { const i = RANK[lang].findIndex(re => re.test(v.name)); return i < 0 ? RANK[lang].length : i; };

// Voices worth offering for a language, best first.
export function listVoices(lang) {
  if (!synth) return [];
  return synth.getVoices()
    .filter(v => v.lang.toLowerCase().startsWith(lang) && !NOVELTY.test(v.name))
    .sort((a, b) => rankOf(lang, a) - rankOf(lang, b) || a.name.localeCompare(b.name));
}
export const voiceId = v => v.voiceURI || v.name;
export const currentVoice = lang => voices[lang];

export function setVoice(lang, id) {
  try { localStorage.setItem(VOICE_KEY[lang], id); } catch {}
  pickVoices();
}

function pickVoices() {
  if (!synth) return;
  for (const lang of ["en", "ru"]) {
    const list = listVoices(lang);
    const stored = readStored(lang);
    voices[lang] = (stored && list.find(v => voiceId(v) === stored)) || list[0] || null;
  }
}
if (synth) { pickVoices(); synth.addEventListener?.("voiceschanged", pickVoices); }

// Split text into runs of one script: "С I всегда am" → [ru "С", en "I", ru "всегда", en "am"].
export function languageRuns(text) {
  const clean = text
    // Symbols some voices read out loud («» came out as "backslash"): drop quotes, turn brackets and arrows into pauses.
    .replace(/[«»“”„"‹›*✔✓✗✘]/g, "")
    .replace(/[‘’`´]/g, "'")
    .replace(/\s*[()[\]{}]\s*/g, ", ")
    .replace(/\s*(→|←|↑|↓|·|=|\+|\/|\|)\s*/g, ", ")
    .replace(/≈\s*/g, "примерно ")
    .replace(/\s*[—–↔]\s*/g, ", ")
    .replace(/−/g, "")
    .replace(/_{2,}/g, " … ")
    .replace(/\s+/g, " ")
    .trim();
  const runs = [];
  for (const m of clean.matchAll(/[А-Яа-яЁё][^A-Za-z]*|[A-Za-z][^А-Яа-яЁё]*/g)) {
    const lang = /[А-Яа-яЁё]/.test(m[0][0]) ? "ru" : "en";
    const piece = m[0].replace(/^[,\s]+|[,\s]+$/g, "");
    if (!piece) continue;
    const last = runs[runs.length - 1];
    if (last && last.lang === lang) last.text += " " + piece; else runs.push({ lang, text: piece });
  }
  return runs;
}

let session = 0;
// Player state, shared by the topic buttons and the floating mini-player.
let queue = null; // { parts, index, onPart, onStop, label }
let status = "idle"; // idle | playing | paused
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn({ status, label: queue?.label || "" }));
export function onPlayerChange(fn) { listeners.add(fn); fn({ status, label: queue?.label || "" }); return () => listeners.delete(fn); }
export const playerStatus = () => status;

export function stopSpeech() {
  session++;
  if (synth) synth.cancel();
  const q = queue; queue = null;
  const was = status; status = "idle";
  q?.onStop?.();
  if (was !== "idle") notify();
}

function runFrom(delay) {
  const my = ++session;
  const next = () => {
    if (my !== session || !queue) return;
    if (queue.index >= queue.parts.length) { stopSpeech(); return; }
    const part = queue.parts[queue.index];
    queue.onPart?.(part.el || null);
    const u = new SpeechSynthesisUtterance(part.text);
    const voice = part.voice || voices[part.lang];
    u.lang = voice?.lang || (part.lang === "ru" ? "ru-RU" : "en-GB");
    if (voice) u.voice = voice;
    // «slower» reads noticeably below the chosen speed (used by «Медленнее» in the dictation).
    const base = RATES[part.lang][getRate()];
    u.rate = queue.slower ? Math.max(0.45, base - 0.25) : base;
    const done = () => { if (my !== session || !queue) return; queue.index++; next(); };
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  };
  // Chrome drops an utterance queued right after cancel(); give the cancel a moment to settle.
  if (delay) setTimeout(next, 120); else next();
}

// Play a queue of { text, lang, el? }. onPart(el) fires when a part starts; onStop fires once at the end or on stop.
// A label ("Тема", "Примеры") shows the floating player; short phrases play without it.
export function speakQueue(parts, { onPart, onStop, label = "", slower = false } = {}) {
  if (!canSpeak() || !parts.length) return;
  const wasBusy = synth.speaking || synth.pending;
  stopSpeech();
  queue = { parts, index: 0, onPart, onStop, label, slower };
  status = "playing";
  notify();
  runFrom(wasBusy);
}

// Pause keeps the position: the current part starts again on resume (reliable on every browser, unlike synth.pause()).
export function pauseSpeech() {
  if (status !== "playing") return;
  session++;
  synth.cancel();
  status = "paused";
  notify();
}
export function resumeSpeech() {
  if (status !== "paused" || !queue) return;
  status = "playing";
  notify();
  runFrom(true);
}

export function speakEnglish(text, handlers) {
  speakQueue([{ lang: "en", text }], handlers);
}

// Build the reading queue for a theory block: headings, paragraphs, examples, table rows, tips.
const BLOCKS = "h3, p, .formula, .examples li, .ng h4, .ng li, .compare > div, tbody tr, .pit .tag, .pit > span:not(.tag), .sticky .tag, .sticky > span:not(.tag)";
export function theoryQueue(root) {
  const found = [...root.querySelectorAll(BLOCKS)];
  const blocks = found.filter(el => !found.some(other => other !== el && other.contains(el)));
  const parts = [];
  for (const el of blocks) {
    const copy = el.cloneNode(true);
    copy.querySelectorAll(".no, .say, button").forEach(n => n.remove());
    if (el.matches("tr")) copy.querySelectorAll("td").forEach(td => td.append(", "));
    if (el.matches(".examples li, .compare > div")) copy.querySelectorAll("span").forEach(s => s.append(". "));
    for (const run of languageRuns(copy.textContent.replace(/([.?!])\s*\.\s/g, "$1 "))) parts.push({ ...run, el });
  }
  return parts;
}

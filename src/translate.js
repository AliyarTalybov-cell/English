// Word translation on tap: our own dictionary, no external service.
// Two sources: the core A1 list and the vocabulary of the lessons (generated at build time).
import { CORE } from "./dictionary.js";
import LESSONS from "./dictionary-lessons.js";

const DICT = { ...LESSONS, ...CORE };

// é → e, кавычки-апострофы → ', лишние знаки по краям убираем
const clean = w => w.toLowerCase().replace(/[’‘`´]/g, "'")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/^[^a-z']+|[^a-z']+$/g, "");

// Contractions: the student taps «isn't» and gets the two words behind it.
const SHORT = {
  "i'm": "I am · я есть", "you're": "you are", "he's": "he is / he has", "she's": "she is / she has",
  "it's": "it is · это", "we're": "we are", "they're": "they are", "that's": "that is",
  "there's": "there is · есть", "what's": "what is", "where's": "where is", "who's": "who is",
  "isn't": "is not · не", "aren't": "are not · не", "wasn't": "was not · не был", "weren't": "were not · не были",
  "don't": "do not · не", "doesn't": "does not · не", "didn't": "did not · не (в прошлом)",
  "haven't": "have not · нет", "hasn't": "has not · нет", "can't": "cannot · не могу, не умею",
  "won't": "will not · не буду", "let's": "let us · давай", "i'd": "I would · я бы", "i've": "I have",
};

// Base forms: works → work, studies → study, stopped → stop, making → make.
function forms(w) {
  const out = [w];
  if (w.endsWith("'s") || w.endsWith("s'")) out.push(w.slice(0, -2));
  const add = x => { if (x && x.length > 1 && !out.includes(x)) out.push(x); };
  if (w.endsWith("ies")) add(w.slice(0, -3) + "y");
  if (w.endsWith("es")) { add(w.slice(0, -2)); add(w.slice(0, -1)); }
  if (w.endsWith("s")) add(w.slice(0, -1));
  if (w.endsWith("ied")) add(w.slice(0, -3) + "y");
  if (w.endsWith("ed")) { add(w.slice(0, -2)); add(w.slice(0, -1)); }
  if (w.endsWith("ing")) { add(w.slice(0, -3)); add(w.slice(0, -3) + "e"); }
  if (/([bdgmnprt])\1(ed|ing)$/.test(w)) add(w.replace(/([bdgmnprt])\1(ed|ing)$/, "$1"));
  return out;
}

// Look up a word, and also the phrase it starts (get up, a lot of).
export function translate(word, nextWords = []) {
  const w = clean(word);
  if (!w) return null;
  if (SHORT[w]) return { word: w, ru: SHORT[w] };
  const next = nextWords.map(clean).filter(Boolean);
  for (let n = Math.min(2, next.length); n > 0; n--) {
    const phrase = [w, ...next.slice(0, n)].join(" ");
    if (DICT[phrase]) return { word: phrase, ru: DICT[phrase] };
  }
  for (const f of forms(w)) {
    if (DICT[f]) return { word: f === w ? w : `${w} → ${f}`, ru: DICT[f] };
    if (DICT["a " + f]) return { word: f, ru: DICT["a " + f] };
    if (DICT["an " + f]) return { word: f, ru: DICT["an " + f] };
    if (DICT["to " + f]) return { word: f, ru: DICT["to " + f] };
  }
  return null;
}

// Service words: everybody meets them in every sentence, so there is no point in saving them
// to «Мои слова» — that list is for words worth learning.
const BASIC = new Set(`a an the i you he she it we they me him her us them my your his its our their mine yours
am is are was were be been being do does did done have has had can could will would should may might must
to of in on at for with from by about into over under as and or but so if not no yes this that these those
there here what who where when why how which whose very too also just only now then today tomorrow yesterday
more most some any all both each every other another same one two three four five six seven eight nine ten
please thanks thank hello hi bye ok okay well little much many good bad big small new old`.split(/\s+/).filter(Boolean));
export const isBasicWord = w => BASIC.has(String(w || "").toLowerCase().replace(/[’‘`´]/g, "'").trim());

export const dictionarySize = () => Object.keys(DICT).length;

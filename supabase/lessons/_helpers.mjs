// Helpers for writing lesson sources. Each lesson file exports { slug, title, subtitle, position, sections }.
// Item shapes match what src/engine.js renders: choice · input · order · fix.

// choice: q may contain ___ for a blank; b = { wrongOption: "why it's wrong" }
export const ch = (q, o, a, ex, b) => ({ t: "choice", q, o, a, ex, ...(b ? { b } : {}) });

// input: a = accepted answers (string or array); p = task prompt under the question; h = hint for one-word answers
export const inp = (q, a, ex, p, h) => ({ t: "input", q, a: [].concat(a), ex, ...(p ? { p } : {}), ...(h ? { h } : {}) });

// fix: the student taps the wrong word. `wrong` is that word as written in q (without trailing . ? !).
export function fix(q, wrong, c, ex) {
  const w = q.split(" ").findIndex(t => t.replace(/[.?!,]$/, "") === wrong);
  if (w < 0) throw new Error(`fix: "${wrong}" not found in "${q}"`);
  return { t: "fix", q, w, c, ex };
}

// order: tiles come from the first answer, shuffled deterministically; `keepCase` lists words that stay capitalised.
export function ord(answer, ex, more = [], keepCase = []) {
  const words = answer.replace(/[.?!]$/, "").split(" ")
    .map((w, i) => i === 0 && w !== "I" && !keepCase.includes(w) ? w.toLowerCase() : w);
  let seed = [...answer].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296;
  let w = words.slice();
  for (let tries = 0; tries < 10; tries++) {
    for (let i = w.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [w[i], w[j]] = [w[j], w[i]]; }
    if (w.join(" ") !== words.join(" ")) break;
  }
  return { t: "order", w, a: [answer, ...more], ex };
}

export const group = (title, items) => ({ title, items });

// Theory building blocks (classes from src/style.css).
export const formula = (...parts) => `<div class="formula">${parts.map((p, i) =>
  (i ? '<span class="plus">+</span>' : "") + (p.startsWith("!") ? `<span class="slot be">${p.slice(1)}</span>` : `<span class="slot">${p}</span>`)).join("")}</div>`;
export const table = (head, rows) => `<div class="tbl"><table>
<thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead>
<tbody>
${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
</tbody></table></div>`;
// examples: [ru, en, why?]
export const examples = rows => `<ul class="examples">
${rows.map(([ru, en, why]) => `<li><span class="ru">${ru}</span><span class="en">${en}</span>${why ? `<span class="why">${why}</span>` : ""}</li>`).join("\n")}
</ul>`;
export const pit = (...lines) => `<div class="pit"><span class="tag">Частая ошибка</span>${lines.map(l => `<span>${l}</span>`).join("")}</div>`;
export const no = s => `<span class="no">${s}</span>`;
export const yes = s => `<span class="yes">${s} ✔</span>`;
export const sticky = (text, tag = "С вашей доски") => `<div class="sticky"><span class="tag">${tag}</span><span>${text}</span></div>`;
export const h3 = s => `<h3>${s}</h3>`;
export const p = s => `<p>${s}</p>`;
export const compare = (...cols) => `<div class="compare">${cols.map(([en, ru, small]) =>
  `<div><span class="en">${en}</span><span class="ru">${ru}</span>${small ? `<span class="small">${small}</span>` : ""}</div>`).join("")}</div>`;
export const ng = (...cards) => `<div class="ng-grid">${cards.map(([title, list]) =>
  `<div class="ng"><h4>${title}</h4><ul>${list.map(li => `<li>${li}</li>`).join("")}</ul></div>`).join("")}</div>`;
export const html = (...parts) => parts.join("\n");

// Add more theory and a new exercise group to the end of an existing section.
// New groups go last, so existing item ids (section-group-item) and students' progress stay valid.
export function extend(lesson, sectionId, moreTheory, ...groups) {
  const s = lesson.sections.find(x => x.id === sectionId);
  if (!s) throw new Error(`extend: no section ${sectionId} in ${lesson.slug}`);
  if (moreTheory) s.theory += "\n" + moreTheory;
  s.groups.push(...groups);
  return lesson;
}

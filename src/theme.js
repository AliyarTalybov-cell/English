// Theme: "system" (no attribute, follows OS), "light" or "dark" (stamped on <html>).
const KEY = "english-theme";
const COLORS = { light: "#F3F5F2", dark: "#11161B" };
const ICONS = {
  system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
};
const LABELS = { system: "Как в системе", light: "Светлая", dark: "Тёмная" };

export function getTheme() {
  try { const t = localStorage.getItem(KEY); return t === "light" || t === "dark" ? t : "system"; } catch { return "system"; }
}

export function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", mode);
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.remove());
  const add = (content, media) => {
    const m = document.createElement("meta");
    m.name = "theme-color"; m.content = content; if (media) m.media = media;
    document.head.appendChild(m);
  };
  if (mode === "system") { add(COLORS.light, "(prefers-color-scheme: light)"); add(COLORS.dark, "(prefers-color-scheme: dark)"); }
  else add(COLORS[mode]);
}

let animTimer;
export function setTheme(mode) {
  try { if (mode === "system") localStorage.removeItem(KEY); else localStorage.setItem(KEY, mode); } catch {}
  const root = document.documentElement;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-anim");
    clearTimeout(animTimer);
    animTimer = setTimeout(() => root.classList.remove("theme-anim"), 320);
  }
  applyTheme(mode);
}

export function themeControlHtml() {
  const mode = getTheme();
  return `<div class="theme">
    <button class="theme-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Тема: ${LABELS[mode]}" data-theme-btn>${ICONS[mode]}</button>
    <div class="theme-menu" role="menu" hidden data-theme-menu>
      ${["system", "light", "dark"].map(m => `<button type="button" role="menuitemradio" aria-checked="${m === mode}" data-mode="${m}">${ICONS[m]}${LABELS[m]}</button>`).join("")}
    </div>
  </div>`;
}

// register: how to attach document listeners; the app passes a version that drops them when the screen changes.
export function bindThemeControl(scope, register = (type, fn) => document.addEventListener(type, fn)) {
  const btn = scope.querySelector("[data-theme-btn]");
  const menu = scope.querySelector("[data-theme-menu]");
  if (!btn || !menu) return;
  let closeTimer;
  const close = () => {
    btn.setAttribute("aria-expanded", "false");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { menu.hidden = true; return; }
    menu.classList.add("closing");
    closeTimer = setTimeout(() => { menu.hidden = true; menu.classList.remove("closing"); }, 150);
  };
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const open = menu.hidden || menu.classList.contains("closing");
    if (!open) { close(); return; }
    clearTimeout(closeTimer); menu.classList.remove("closing");
    menu.hidden = false; btn.setAttribute("aria-expanded", "true");
    menu.querySelector('[aria-checked="true"]')?.focus();
  });
  menu.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
    const mode = b.dataset.mode;
    setTheme(mode);
    menu.querySelectorAll("[data-mode]").forEach(x => x.setAttribute("aria-checked", String(x === b)));
    btn.innerHTML = ICONS[mode];
    btn.setAttribute("aria-label", `Тема: ${LABELS[mode]}`);
    close(); btn.focus();
  }));
  register("click", e => { if (scope.isConnected && !menu.hidden && !menu.contains(e.target)) close(); });
  register("keydown", e => { if (e.key === "Escape" && !menu.hidden) { close(); btn.focus(); } });
}

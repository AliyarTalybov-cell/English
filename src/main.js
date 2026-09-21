import "./style.css";
import { api, auth, avatar, roles, messages, profile, cache, authMessage, AuthRequired } from "./api.js";
import { mountLesson, setWordSaver, esc, sayButton } from "./engine.js";
import { getTheme, applyTheme, themeControlHtml, bindThemeControl } from "./theme.js";
import { COURSE, LESSON_GOALS, LESSON_LABELS, LEVEL, AUTHOR } from "./course.js";
import { stopSpeech } from "./speech.js";
import { setupWords, renderWords, wordsNote, fillWordsLine } from "./words.js";

applyTheme(getTheme());
// The word popup in lessons can save a word to «Мои слова».
setWordSaver((word, ru) => api.addWord(word, ru));
const app = document.getElementById("app");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function toast(text) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("out"), 3250);
  setTimeout(() => t.remove(), 3500);
}

const PROFILE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"/></svg>';
const WORDS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 4h11a1 1 0 0 1 1 1v15l-6.5-4-6.5 4V5a1 1 0 0 1 1-1z"/></svg>';
const USERS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.6 3 2.3 3 4.7"/></svg>';
const STUDENTS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6"/></svg>';
const EXIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h11"/></svg>';

let currentEmail = "";
let currentAvatar = "";
let currentName = ""; // «Имя Фамилия» from personal details, filled in on the profile page
// Role of the signed-in user ('admin', 'teacher' or null), loaded once per account.
let currentRole = null, roleFor = "";
const setUser = user => {
  currentEmail = user?.email || ""; currentAvatar = user?.user_metadata?.avatar_url || "";
  if ((user?.id || "") !== roleFor) { currentRole = null; roleFor = ""; unread = 0; currentName = ""; }
};
// The first load waits; later screens refresh it in the background, so a role given or taken
// by the admin shows up in the menu without signing in again.
async function loadRole(user) {
  if (!user) return;
  if (roleFor === user.id) { roles.mine().then(r => { if (roleFor === user.id) currentRole = r; }).catch(() => {}); return; }
  try { currentRole = await roles.mine(); roleFor = user.id; } catch { currentRole = null; }
}
// Photo if the user uploaded one, otherwise the first letter of the email.
const avaInner = () => currentAvatar
  ? `<img src="${esc(currentAvatar)}" alt="" decoding="async">`
  : esc((currentEmail[0] || "?").toUpperCase());
// «Имя Фамилия» when filled in, otherwise the email.
const fullName = u => [u?.first_name, u?.last_name].filter(Boolean).join(" ");
const displayName = u => fullName(u) || u?.email || "";
// +79991234567 → +7 (999) 123-45-67; other countries: + and the digits.
function fmtPhone(p) {
  const d = String(p || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length === 11 && d[0] === "7") return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  return "+" + d;
}
// Name + email lines for lists: the name is the headline, the email goes small under it.
const nameLines = (u, cls = "user-mail") => fullName(u)
  ? `<p class="${cls}">${esc(fullName(u))}</p><p class="user-email">${esc(u.email || "")}</p>`
  : `<p class="${cls}">${esc(u.email || "")}</p>`;

function topbar(showLogout) {
  return `<div class="topbar">
    <a class="brand" href="#/">English<span>.</span></a>
    <div class="topbar-right">
      ${showLogout ? `<div class="acct">
        <button class="who" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Аккаунт: ${esc(currentEmail)}" data-acct><span class="who-ava${currentAvatar ? " has-photo" : ""}" aria-hidden="true">${avaInner()}</span>${unreadBadge()}<span class="who-mail">${esc(currentEmail).replace("@", '<span class="who-at">@</span>')}</span></button>
        <div class="acct-pop" role="dialog" aria-label="Аккаунт" hidden data-acct-pop></div>
      </div>` : ""}
      ${themeControlHtml()}
    </div>
  </div>`;
}

// Unread messages: a red count on the avatar and next to «Сообщения» in the menu.
let unread = 0;
const unreadText = n => (n > 99 ? "99+" : String(n));
const unreadBadge = () => `<span class="unread-badge" data-unread${unread ? "" : " hidden"}>${unreadText(unread)}</span>`;
function paintUnread() {
  document.querySelectorAll("[data-unread]").forEach(el => {
    const was = el.hidden;
    el.hidden = !unread;
    el.textContent = unreadText(unread);
    if (was && unread) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  });
  const who = document.querySelector("[data-acct]");
  if (who) who.setAttribute("aria-label", `Аккаунт: ${currentEmail}${unread ? `, непрочитанных сообщений: ${unread}` : ""}`);
}
async function refreshUnread() {
  if (!roleFor) return;
  try { unread = await messages.unread(); paintUnread(); } catch {}
}
// Check every 30 s while the tab is visible, and right away when it comes back.
setInterval(() => { if (!document.hidden) refreshUnread(); }, 30000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshUnread(); });

function bindTopbar() {
  const bar = app.querySelector(".topbar");
  if (!bar) return;
  bindThemeControl(bar, onDoc);
  bindAccount(bar);
  // Logo: a small hop on tap (hover has its own animation on devices with a mouse).
  bar.querySelector(".brand")?.addEventListener("pointerdown", e => {
    const b = e.currentTarget;
    b.classList.remove("pressed"); void b.offsetWidth; b.classList.add("pressed");
  });
  bar.querySelector(".brand")?.addEventListener("click", e => {
    // Already on the lessons list: the hash would not change, so scroll to the top instead.
    if (location.hash === "#/" || location.hash === "") { e.preventDefault(); scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }); }
  });
}

// Account popover: tap the avatar / email to see the account, tap «Выйти» to confirm logging out.
function bindAccount(bar) {
  const pop = bar.querySelector("[data-acct-pop]");
  if (!pop) return;
  const who = bar.querySelector("[data-acct]");
  let opener = null;
  const close = () => {
    if (pop.hidden) return;
    pop.hidden = true;
    who.setAttribute("aria-expanded", "false");
  };
  const open = (mode, from) => {
    opener = from;
    const email = `<span class="acct-email">${esc(currentEmail)}</span>`;
    pop.innerHTML = mode === "confirm"
      ? `<p class="acct-title">Выйти из аккаунта?</p>${email}
         <div class="acct-actions"><button type="button" class="btn warn" data-yes>Да, выйти</button><button type="button" class="btn quiet" data-no>Отмена</button></div>`
      : `<p class="acct-label">Вы вошли как</p>${email}
         <div class="acct-menu">
           <a class="acct-item" href="#/profile" data-profile><span class="acct-ico">${PROFILE_ICON}</span>Профиль и прогресс</a>
           <a class="acct-item" href="#/words" data-profile><span class="acct-ico">${WORDS_ICON}</span>Мои слова</a>
           <a class="acct-item" href="#/messages" data-profile><span class="acct-ico">${CHAT_ICON}</span>Сообщения${unreadBadge().replace("unread-badge", "unread-badge inline")}</a>
           ${currentRole === "admin" || currentRole === "teacher" ? `<a class="acct-item" href="#/students" data-profile><span class="acct-ico">${STUDENTS_ICON}</span>Ученики</a>` : ""}
           ${currentRole === "admin" ? `<a class="acct-item" href="#/users" data-profile><span class="acct-ico">${USERS_ICON}</span>Пользователи</a>` : ""}
           <button type="button" class="acct-item danger" data-to-logout><span class="acct-ico">${EXIT_ICON}</span>Выйти</button>
         </div>`;
    pop.hidden = false;
    pop.dataset.mode = mode;
    who.setAttribute("aria-expanded", String(mode === "info"));
    pop.querySelector("[data-no]")?.addEventListener("click", () => { close(); opener?.focus(); });
    pop.querySelectorAll("[data-profile]").forEach(a => a.addEventListener("click", () => close()));
    pop.querySelector("[data-to-logout]")?.addEventListener("click", () => open("confirm", who));
    pop.querySelector("[data-yes]")?.addEventListener("click", logout);
    pop.querySelector("[data-yes], [data-profile]")?.focus({ preventScroll: true });
  };
  who.addEventListener("click", e => { e.stopPropagation(); pop.hidden || pop.dataset.mode !== "info" ? open("info", who) : close(); });
  pop.addEventListener("click", e => e.stopPropagation());
  const onDocClose = () => { if (bar.isConnected) close(); };
  const onKey = e => { if (e.key === "Escape" && !pop.hidden) { close(); opener?.focus(); } };
  onDoc("click", onDocClose);
  onDoc("keydown", onKey);
}

// Log out without waiting on the network: the screen switches at once, the server call finishes in the background.
let loggingOut = false;
async function logout() {
  if (loggingOut) return;
  loggingOut = true;
  removeFloating();
  const serverSignOut = auth.signOut().catch(() => {});
  await Promise.race([serverSignOut, sleep(1500)]);
  try { localStorage.removeItem("english-auth"); } catch {}
  setUser(null);
  history.replaceState(null, "", location.pathname + "#/");
  if (!reduced()) { app.classList.add("leaving"); await sleep(140); app.classList.remove("leaving"); }
  renderAuth("login");
  toast("Вы вышли из аккаунта");
  loggingOut = false;
}

// Every screen takes a number; an answer that arrives after the user left is ignored.
let screenToken = 0;
// A background refresh must not wipe what the person is doing: no repaint while a field is focused.
const busyEditing = () => !!app.querySelector("main")?.contains(document.activeElement) && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
// Draw again without the entrance animation and without moving the page.
function repaint(paint, data) {
  const y = scrollY;
  paint(data, true);
  scrollTo(0, y);
}
let stopChat = null;
// Document-level listeners of the current screen: dropped when the screen changes, so they do not pile up.
let docCleanups = [];
function onDoc(type, fn, opts) {
  document.addEventListener(type, fn, opts);
  docCleanups.push(() => document.removeEventListener(type, fn, opts));
}
function removeFloating() {
  stopSpeech();
  stopChat?.(); stopChat = null;
  docCleanups.forEach(off => off()); docCleanups = [];
  document.querySelectorAll(".to-top").forEach(b => b.remove());
}

// Stagger direct children of a container (CSS reads --i for the delay).
function stagger(container, max = 10) {
  if (!container) return;
  container.classList.add("stagger");
  [...container.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, max)));
}

// Count numbers up from 0 on [data-count] elements.
function countUp(scope) {
  scope.querySelectorAll("[data-count]").forEach(el => {
    const target = Number(el.dataset.count), suffix = el.dataset.suffix || "";
    if (reduced() || !target) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 700;
    const tick = now => {
      const p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0" + suffix;
    requestAnimationFrame(tick);
  });
}

function handleError(err) {
  if (err instanceof AuthRequired) {
    auth.signOut().finally(() => renderAuth("login", "Сессия закончилась. Войдите снова."));
    return;
  }
  app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Не удалось загрузить данные. Проверьте интернет и обновите страницу.</p></main>`;
  bindTopbar();
}

/* ---------- auth ---------- */
const AUTH_TEXT = {
  login: { title: "Вход", pwLabel: "Пароль", submit: "Войти", autocomplete: "current-password",
    note: `<button type="button" class="inline-link" data-forgot>Забыли пароль?</button>` },
  register: { title: "Регистрация", pwLabel: "Пароль · минимум 6 символов", submit: "Создать аккаунт", autocomplete: "new-password",
    note: "Письмо с подтверждением не придёт: аккаунт работает сразу после регистрации." },
};

function renderAuth(startMode = "login", message = "") {
  removeFloating();
  let mode = startMode;
  const T = () => AUTH_TEXT[mode];
  document.title = `${T().title} · English`;
  app.innerHTML = topbar(false) + `
    <main class="wrap login">
      <form class="login-card auth-card" novalidate>
        <p class="login-brand">English<span>.</span></p>
        <div class="tabs" role="tablist" data-active="${mode}">
          <button type="button" role="tab" aria-selected="${mode === "login"}" data-mode="login">Вход</button>
          <button type="button" role="tab" aria-selected="${mode === "register"}" data-mode="register">Регистрация</button>
        </div>
        <label class="field" for="auth-email"><span>Email</span>
          <input class="inp" id="auth-email" type="email" autocomplete="email" autocapitalize="off" spellcheck="false" inputmode="email" required>
        </label>
        <label class="field" for="auth-password"><span data-pw-label>${T().pwLabel}</span>
          <span class="pw">
            <input class="inp" id="auth-password" type="password" autocomplete="${T().autocomplete}" minlength="6" required>
            <button type="button" class="pw-toggle" aria-label="Показать пароль" data-pw>Показать</button>
          </span>
        </label>
        <button class="btn" type="submit" data-submit>${T().submit}</button>
        <p class="login-msg" aria-live="polite">${esc(message)}</p>
        <p class="auth-note" data-note>${T().note}</p>
      </form>
    </main>`;
  bindTopbar();
  const form = app.querySelector("form");
  const email = app.querySelector("#auth-email");
  const password = app.querySelector("#auth-password");
  const msg = app.querySelector(".login-msg");
  const submitBtn = app.querySelector("[data-submit]");
  const tabs = app.querySelector(".tabs");
  const note = app.querySelector("[data-note]");
  const pwLabel = app.querySelector("[data-pw-label]");
  stagger(form);

  const showMsg = (text, info) => {
    msg.className = "login-msg" + (info ? " info" : "");
    msg.textContent = text;
    if (text) { void msg.offsetWidth; msg.classList.add("show"); }
  };

  // Switch tabs in place so the pill slides and the fields keep their values.
  tabs.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", async () => {
    if (b.dataset.mode === mode) return;
    mode = b.dataset.mode;
    tabs.dataset.active = mode;
    tabs.querySelectorAll("[data-mode]").forEach(x => x.setAttribute("aria-selected", String(x.dataset.mode === mode)));
    document.title = `${T().title} · English`;
    showMsg("");
    const fading = [note, pwLabel];
    if (!reduced()) { fading.forEach(n => n.classList.add("swap-out")); await sleep(140); }
    note.innerHTML = T().note;
    pwLabel.textContent = T().pwLabel;
    submitBtn.textContent = T().submit;
    password.autocomplete = T().autocomplete;
    fading.forEach(n => n.classList.remove("swap-out"));
  }));

  bindPasswordToggles(form);
  email.enterKeyHint = "next";
  email.addEventListener("keydown", e => {
    if (e.key !== "Enter" || e.isComposing) return;
    e.preventDefault();
    password.focus();
  });
  form.addEventListener("click", async e => {
    if (!e.target.closest("[data-forgot]")) return;
    await fadeScreen();
    renderForgot(email.value.trim());
  });

  const fail = text => {
    showMsg(text);
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
  };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const em = email.value.trim(), pw = password.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { fail("Введите email, например name@mail.ru."); email.focus(); return; }
    if (pw.length < 6) { fail("Пароль — минимум 6 символов."); password.focus(); return; }
    submitBtn.disabled = true; submitBtn.classList.add("loading");
    showMsg("");
    try {
      if (mode === "login") await auth.signIn(em, pw); else await auth.signUp(em, pw);
      route();
    } catch (err) {
      submitBtn.disabled = false; submitBtn.classList.remove("loading");
      fail(authMessage(err));
    }
  });
  email.focus({ preventScroll: true });
}

function bindPasswordToggles(scope) {
  scope.querySelectorAll("[data-pw]").forEach(btn => btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Скрыть" : "Показать";
    btn.setAttribute("aria-label", show ? "Скрыть пароль" : "Показать пароль");
  }));
}

async function fadeScreen() {
  if (reduced()) return;
  app.classList.add("leaving");
  await sleep(140);
  app.classList.remove("leaving");
}

function authShell(title, inner) {
  removeFloating();
  document.title = `${title} · English`;
  app.innerHTML = topbar(false) + `
    <main class="wrap login">
      <form class="login-card auth-card" novalidate>
        <p class="login-brand">English<span>.</span></p>
        ${inner}
      </form>
    </main>`;
  bindTopbar();
  const form = app.querySelector("form");
  stagger(form);
  const msg = form.querySelector(".login-msg");
  const showMsg = (text, kind = "") => {
    msg.className = "login-msg" + (kind ? " " + kind : "");
    msg.textContent = text;
    if (text) { void msg.offsetWidth; msg.classList.add("show"); }
  };
  const fail = text => {
    showMsg(text);
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
  };
  return { form, showMsg, fail };
}

/* ---------- forgot password ---------- */
function renderForgot(prefill = "", message = "") {
  const { form, showMsg, fail } = authShell("Восстановление пароля", `
    <h1 class="auth-title">Восстановление пароля</h1>
    <p class="login-sub">Введите email, с которым регистрировались. Пришлём ссылку для нового пароля.</p>
    <label class="field" for="forgot-email"><span>Email</span>
      <input class="inp" id="forgot-email" type="email" autocomplete="email" autocapitalize="off" spellcheck="false" inputmode="email" required>
    </label>
    <button class="btn" type="submit" data-submit>Отправить ссылку</button>
    <p class="login-msg" aria-live="polite"></p>
    <div class="sent" hidden data-sent>
      <p class="sent-title">Письмо отправлено</p>
      <p>Проверьте почту <b data-sent-to></b>, в том числе папку «Спам». Письмо придёт от Supabase на английском: «Reset your password». Ссылка действует 1 час и откроется на любом устройстве.</p>
    </div>
    <p class="auth-note"><button type="button" class="inline-link" data-back>← Вернуться ко входу</button></p>`);
  const email = form.querySelector("#forgot-email");
  const submitBtn = form.querySelector("[data-submit]");
  email.value = prefill;
  if (message) showMsg(message);
  form.querySelector("[data-back]").addEventListener("click", async () => { await fadeScreen(); renderAuth("login"); });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const em = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { fail("Введите email, например name@mail.ru."); email.focus(); return; }
    submitBtn.disabled = true; submitBtn.classList.add("loading"); showMsg("");
    try {
      await auth.resetPassword(em);
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "Отправить ещё раз";
      form.querySelector("[data-sent-to]").textContent = em;
      form.querySelector("[data-sent]").hidden = false;
      setTimeout(() => { submitBtn.disabled = false; }, 60000);
    } catch (err) {
      submitBtn.disabled = false; submitBtn.classList.remove("loading");
      fail(authMessage(err));
    }
  });
  email.focus({ preventScroll: true });
}

/* ---------- new password (after the email link) ---------- */
function renderNewPassword() {
  const { form, fail } = authShell("Новый пароль", `
    <h1 class="auth-title">Новый пароль</h1>
    <p class="login-sub">${currentEmail ? `Для аккаунта <b>${esc(currentEmail)}</b>` : "Придумайте новый пароль"}</p>
    <label class="field" for="new-password"><span>Новый пароль · минимум 6 символов</span>
      <span class="pw">
        <input class="inp" id="new-password" type="password" autocomplete="new-password" minlength="6" required>
        <button type="button" class="pw-toggle" aria-label="Показать пароль" data-pw>Показать</button>
      </span>
    </label>
    <label class="field" for="new-password-2"><span>Повторите пароль</span>
      <span class="pw">
        <input class="inp" id="new-password-2" type="password" autocomplete="new-password" minlength="6" required>
        <button type="button" class="pw-toggle" aria-label="Показать пароль" data-pw>Показать</button>
      </span>
    </label>
    <button class="btn" type="submit" data-submit>Сохранить пароль</button>
    <p class="login-msg" aria-live="polite"></p>`);
  bindPasswordToggles(form);
  const p1 = form.querySelector("#new-password"), p2 = form.querySelector("#new-password-2");
  const submitBtn = form.querySelector("[data-submit]");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (p1.value.length < 6) { fail("Пароль — минимум 6 символов."); p1.focus(); return; }
    if (p1.value !== p2.value) { fail("Пароли не совпадают."); p2.focus(); return; }
    submitBtn.disabled = true; submitBtn.classList.add("loading");
    try {
      await auth.updatePassword(p1.value);
      recovery = false;
      history.replaceState(null, "", location.pathname + "#/");
      toast("Пароль обновлён");
      route();
    } catch (err) {
      submitBtn.disabled = false; submitBtn.classList.remove("loading");
      fail(authMessage(err));
    }
  });
  p1.focus({ preventScroll: true });
}

/* ---------- lessons list ---------- */
async function renderList() {
  removeFloating();
  document.title = "English · уроки";
  const token = ++screenToken;
  const saved = cache.get("lessons");
  if (saved) paintList(saved, false);
  else {
    app.innerHTML = topbar(true) + `
    <main class="wrap" aria-busy="true">
      <div class="skel-wrap" aria-label="Загружаю уроки">
        <div class="skel line"></div><div class="skel title"></div><div class="skel text"></div>
        <div class="skel-row3"><div class="skel row"></div><div class="skel row"></div><div class="skel row"></div></div>
        <div class="skel card"></div>
      </div>
    </main>`;
    bindTopbar();
  }
  try {
    const [lessons, due] = await Promise.all([
      api.listLessons(),
      api.dueReviews().catch(() => ({ total: 0, items: [] })),
    ]);
    if (token !== screenToken) return; // the person already went elsewhere
    const same = saved && JSON.stringify(saved) === JSON.stringify(lessons)
      && JSON.stringify(cache.get("due")) === JSON.stringify(due);
    cache.set("lessons", lessons);
    cache.set("due", due);
    if (!saved) paintList(lessons, false);
    else if (!same && !busyEditing()) repaint(paintList, lessons);
  } catch (err) {
    if (!saved) handleError(err); // with cached lessons on screen a failed refresh stays silent
  }
}

// «Повторить сегодня»: topics whose repetition date has come. Hidden when there is nothing to repeat.
function dueBlock() {
  const due = cache.get("due");
  const items = (due?.items || []).slice(0, 3);
  if (!items.length) return "";
  // One topic is not worth a whole section: it goes as a single line next to the daily line.
  if (items.length === 1) {
    const d = items[0];
    return `<p class="hint-line due-line">Пора повторить: <a href="#/lesson/${encodeURIComponent(d.lesson_slug)}?t=${encodeURIComponent(d.section_id)}">${esc(d.nav)}</a></p>`;
  }
  const rest = (due.total || items.length) - items.length;
  return `<section class="card-block due-block">
    <p class="eyebrow">Повторение</p>
    <h2>Повторить сегодня</h2>
    <ul class="due-list">${items.map(d => `<li><a class="due-row" href="#/lesson/${encodeURIComponent(d.lesson_slug)}?t=${encodeURIComponent(d.section_id)}">
      <span class="due-main"><b>${esc(d.nav)}</b><small>${esc(d.lesson_title)}</small></span>
      ${d.mistakes ? `<span class="due-tag">ошибок: ${d.mistakes}</span>` : ""}
      <span class="arr" aria-hidden="true">→</span>
    </a></li>`).join("")}</ul>
    ${rest > 0 ? `<p class="hint-line">Ещё ${rest} ${plural(rest, "тема", "темы", "тем")} в очереди</p>` : ""}
  </section>`;
}

function paintList(lessons, silent) {

    const sum = lessons.reduce((a, l) => ({ done: a.done + l.done, total: a.total + l.total, ok: a.ok + l.ok, mistakes: a.mistakes + l.mistakes }), { done: 0, total: 0, ok: 0, mistakes: 0 });
    const firstTry = sum.done ? Math.round(sum.ok / sum.done * 100) : 0;
    app.innerHTML = topbar(true) + `
      <main class="wrap">
        <header class="hero">
          <p class="kicker">Курс английского · ${esc(COURSE.level)}</p>
          <h1>Уроки</h1>
          <p class="lead">${esc(COURSE.lead)}</p>
        </header>
        ${dueBlock()}
        ${lessons.length ? `
        <details class="about"${sum.done ? "" : " open"}>
          <summary>Чему вы научитесь за курс</summary>
          <ul class="outcomes">${COURSE.outcomes.map(([what, detail]) => `<li><b>${esc(what)}</b><span>${esc(detail)}</span></li>`).join("")}</ul>
          <p class="about-note">В каждом уроке сначала объяснение темы, потом упражнения с разбором ошибок. В конце — контрольные.</p>
          <p class="about-note">${esc(COURSE.next)}</p>
        </details>
        <section class="summary" aria-label="Общий прогресс">
          <div class="stat"><b><span data-count="${sum.done}">${sum.done}</span><small class="muted" style="font-size:.55em"> / ${sum.total}</small></b><span>заданий решено</span></div>
          <div class="stat"><b>${sum.done ? `<span data-count="${firstTry}" data-suffix="%">${firstTry}%</span>` : "—"}</b><span>с первой попытки</span></div>
          <div class="stat${sum.mistakes ? " warn" : ""}"><b><span data-count="${sum.mistakes}">${sum.mistakes}</span></b><span>ошибок ждут повторения</span></div>
        </section>
        <ul class="lessons">${lessons.map((l, i, all) => {
          const pct = l.total ? Math.round(l.done / l.total * 100) : 0;
          const base = `#/lesson/${encodeURIComponent(l.slug)}`;
          const finished = l.done === l.total;
          const primary = finished
            ? `<a class="btn ghost" href="${base}">Открыть урок</a>`
            : l.done === 0
              ? `<a class="btn" href="${base}">Начать урок</a>`
              : `<a class="btn" href="${base}?t=${encodeURIComponent(l.resume_id)}">Продолжить: тема ${l.resume_index} · ${esc(l.resume_title)}</a>`;
          return `<li class="lesson-card">
            <p class="eyebrow">${esc(LESSON_LABELS[l.slug] || `Урок ${all.slice(0, i + 1).filter(x => !LESSON_LABELS[x.slug]).length}`)}${finished ? " · пройден" : ""}</p>
            <h2><a class="lesson-title-link" href="${base}">${esc(l.title)}</a></h2>
            ${LESSON_GOALS[l.slug] ? `<p class="goal"><b>Научитесь:</b> ${esc(LESSON_GOALS[l.slug])}</p>` : ""}
            ${l.subtitle ? `<p class="sub">${esc(l.subtitle)}</p>` : ""}
            <div class="bar" aria-hidden="true"><i data-pct="${pct}"></i></div>
            <p class="lesson-meta"><span>сделано ${l.done} из ${l.total}</span><span>с первой попытки ${l.ok}</span></p>
            <div class="lesson-actions">
              ${primary}
              ${l.mistakes ? `<a class="btn warn" href="${base}?t=review">Повторить ошибки: ${l.mistakes}</a>` : ""}
            </div>
          </li>`;
        }).join("")}</ul>` : `<p class="empty">Уроков пока нет.</p>`}
      </main>`;
    bindTopbar();
    const main = app.querySelector("main");
    if (!silent) {
      stagger(main.querySelector(".hero"));
      stagger(main.querySelector(".summary"));
      main.querySelectorAll(".lesson-card").forEach((c, i) => { c.classList.add("screen"); c.style.animationDelay = `${160 + i * 60}ms`; });
      countUp(main);
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      main.querySelectorAll(".bar i[data-pct]").forEach(b => { b.style.width = b.dataset.pct + "%"; });
    }));
}

/* ---------- lesson ---------- */
async function renderLesson(slug, target) {
  removeFloating();
  app.innerHTML = topbar(true) + `
    <main class="wrap" aria-busy="true">
      <div class="skel-wrap" aria-label="Загружаю урок">
        <div class="skel line" style="width:25%"></div><div class="skel title"></div><div class="skel text"></div><div class="skel text" style="width:60%"></div>
        <div class="skel card"></div><div class="skel card"></div>
      </div>
    </main>`;
  bindTopbar();
  window.scrollTo(0, 0);
  try {
    const lesson = await api.getLesson(slug);
    document.title = `${lesson.title} · English`;
    const progress = lesson.progress || {};
    // Resolves to true when saved; answers that failed get a retry mark in the lesson itself.
    const guard = (p, loud) => p.then(() => true, err => {
      if (err instanceof AuthRequired) handleError(err);
      else if (loud) toast("Не сохранилось. Проверьте интернет и попробуйте ещё раз.");
      return false;
    });
    const container = document.createElement("div");
    container.className = "screen";
    app.innerHTML = topbar(true);
    app.appendChild(container);
    bindTopbar();
    mountLesson(container, lesson, progress, {
      status: (id, status) => guard(api.saveStatus(slug, id, status)),
      fixed: id => guard(api.markFixed(slug, id)),
      reset: sectionId => guard(api.resetSection(slug, sectionId), true),
    }, {
      revealFrom: target || null,
      onPortionDone: (sectionId, allRight) => api.scheduleReview(slug, sectionId, allRight).catch(() => {}),
    });
    if (target) requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (!el) return;
      if (target === "review") el.querySelector("[data-rev-start]")?.click();
      el.scrollIntoView({ block: "start" });
    });
  } catch (err) {
    if (err.message === "not_found") {
      app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Такого урока нет. <a class="back" href="#/">← Все уроки</a></p></main>`;
      bindTopbar();
    } else handleError(err);
  }
}

/* ---------- profile ---------- */
// A topic counts as learned when most answers were right the first time; weak topics are the ones to repeat.
const topicScore = s => (s.done ? s.ok / s.done : 0);
// 1 задание, 2 задания, 5 заданий
const plural = (n, one, few, many) => {
  const t = Math.abs(n) % 100, d = t % 10;
  if (t > 10 && t < 20) return many;
  if (d > 1 && d < 5) return few;
  return d === 1 ? one : many;
};
const pct = (a, b) => (b ? Math.round(a / b * 100) : 0);

// Totals and weak/strong topics for the profile and for a teacher's view of a student.
function summarize(lessons) {
  const topics = [];
  let done = 0, total = 0, ok = 0, mistakes = 0;
  for (const l of lessons) for (const s of l.sections || []) {
    topics.push({ ...s, slug: l.slug, lessonTitle: l.title, position: l.position });
    done += s.done; total += s.total; ok += s.ok; mistakes += s.mistakes;
  }
  const started = topics.filter(t => t.done >= 4);
  // Сначала темы, где ошибок больше всего; при равенстве — где меньше ответов с первой попытки.
  const weakAll = started.filter(t => topicScore(t) < 0.8 || t.mistakes)
    .sort((a, b) => b.mistakes - a.mistakes || topicScore(a) - topicScore(b));
  const strong = started.filter(t => topicScore(t) >= 0.85 && !t.mistakes)
    .sort((a, b) => topicScore(b) - topicScore(a) || b.done - a.done).slice(0, 5);
  return { done, total, ok, mistakes, weakAll, strong };
}

// actions = false on a teacher's view of a student: the buttons would open the teacher's own lessons.
function topicRow(t, kind, actions = true) {
  const base = `#/lesson/${encodeURIComponent(t.slug)}`;
  const share = pct(t.ok, t.done);
  return `<li class="topic-row ${kind}">
    <div class="topic-main">
      <p class="topic-name">${esc(t.nav)}</p>
      <p class="topic-lesson">${esc(t.lessonTitle)}</p>
    </div>
    <div class="topic-stats">
      <div class="bar" aria-hidden="true"><i data-pct="${share}"></i></div>
      <p class="topic-meta"><span>с первой попытки ${share}%</span>${t.mistakes ? `<span class="m">ошибок: ${t.mistakes}</span>` : ""}</p>
    </div>
    ${actions ? `<div class="topic-actions">
      <a class="btn quiet" href="${base}?t=${encodeURIComponent(t.id)}">Повторить тему</a>
      ${t.mistakes ? `<a class="btn warn" href="${base}?t=review">Мои ошибки</a>` : ""}
    </div>` : ""}
  </li>`;
}

const CAMERA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>';
const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';
const photoLabel = () => (currentAvatar ? "Сменить фото" : "Загрузить фото");

function accountBlock() {
  return `<section class="me" aria-label="Аккаунт">
    <span class="me-ava${currentAvatar ? " has-photo" : ""}" data-me-ava>${avaInner()}</span>
    <div class="me-main">
      <p class="me-mail" data-me-name${currentName ? "" : " hidden"}>${esc(currentName)}</p>
      <p class="${currentName ? "user-email" : "me-mail"}" data-me-email>${esc(currentEmail)}</p>
      <div class="me-actions">
        <label class="icon-btn" title="${photoLabel()}" data-photo-pick>
          <input type="file" accept="image/*" class="visually-hidden" aria-label="${photoLabel()}" data-photo-input>
          ${CAMERA_ICON}
        </label>
        <button type="button" class="icon-btn danger" title="Удалить фото" aria-label="Удалить фото" aria-haspopup="dialog" aria-expanded="false" data-photo-remove${currentAvatar ? "" : " hidden"}>${TRASH_ICON}</button>
        <div class="acct-pop me-pop" role="dialog" aria-label="Удалить фото" hidden data-photo-confirm>
          <p class="acct-title">Удалить фото?</p>
          <p class="acct-label">Вместо него снова будет первая буква почты.</p>
          <div class="acct-actions"><button type="button" class="btn warn" data-yes>Да, удалить</button><button type="button" class="btn quiet" data-no>Отмена</button></div>
        </div>
      </div>
      <p class="login-msg" aria-live="polite" data-photo-msg></p>
    </div>
  </section>`;
}

// Crop the picture to a centered square and shrink it to 256×256 JPEG (~30 KB) before upload.
async function squareJpeg(file, size = 256) {
  let img;
  try { img = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch {
    img = new Image();
    const url = URL.createObjectURL(file);
    try { img.src = url; await img.decode(); } finally { URL.revokeObjectURL(url); }
  }
  const w = img.width, h = img.height, side = Math.min(w, h);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, size, size);
  return new Promise((ok, bad) => canvas.toBlob(b => (b ? ok(b) : bad(new Error("encode"))), "image/jpeg", 0.85));
}

function bindAccountBlock(main) {
  const input = main.querySelector("[data-photo-input]");
  if (!input) return;
  const pick = main.querySelector("[data-photo-pick]"), ava = main.querySelector("[data-me-ava]");
  const removeBtn = main.querySelector("[data-photo-remove]");
  const pop = main.querySelector("[data-photo-confirm]");
  const msg = main.querySelector("[data-photo-msg]");
  const say = text => { msg.textContent = text; if (text) { msg.classList.remove("show"); void msg.offsetWidth; msg.classList.add("show"); } };
  // Refresh every avatar on the page (profile + top bar) without re-rendering.
  const paint = () => {
    document.querySelectorAll("[data-me-ava], .who-ava").forEach(el => {
      el.innerHTML = avaInner();
      el.classList.toggle("has-photo", !!currentAvatar);
      el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap");
    });
    pick.title = photoLabel();
    input.setAttribute("aria-label", photoLabel());
    removeBtn.hidden = !currentAvatar;
  };
  const busy = on => { ava.classList.toggle("busy", on); pick.classList.toggle("disabled", on); input.disabled = on; removeBtn.disabled = on; };

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    say("");
    if (!file.type.startsWith("image/")) { say("Это не картинка. Выберите фото в формате JPG или PNG."); return; }
    busy(true);
    try {
      let blob;
      try { blob = await squareJpeg(file); }
      catch { say("Не получилось открыть это фото. Попробуйте другое, в формате JPG или PNG."); return; }
      currentAvatar = await avatar.upload(blob);
      paint();
      toast("Фото обновлено");
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      say(/fetch|network/i.test(err?.message || "") ? "Нет связи с сервером. Проверьте интернет." : "Не удалось загрузить фото. Попробуйте ещё раз.");
    } finally { busy(false); }
  });

  // Deleting asks first, in the same kind of popover as «Выйти».
  const close = focus => {
    if (pop.hidden) return;
    pop.hidden = true;
    removeBtn.setAttribute("aria-expanded", "false");
    if (focus) removeBtn.focus();
  };
  removeBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (!pop.hidden) { close(); return; }
    say("");
    pop.hidden = false;
    removeBtn.setAttribute("aria-expanded", "true");
    pop.querySelector("[data-no]").focus({ preventScroll: true });
  });
  pop.addEventListener("click", e => e.stopPropagation());
  pop.querySelector("[data-no]").addEventListener("click", () => close(true));
  pop.querySelector("[data-yes]").addEventListener("click", async () => {
    close();
    busy(true);
    try {
      await avatar.remove();
      currentAvatar = "";
      paint();
      toast("Фото удалено");
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      say("Не удалось удалить фото. Попробуйте ещё раз.");
    } finally { busy(false); }
  });
  onDoc("click", () => { if (pop.isConnected) close(); });
  onDoc("keydown", e => { if (e.key === "Escape" && !pop.hidden) close(true); });
}

/* Profile tabs: «Прогресс» (#/profile), «Личные данные» (#/profile/personal), «Безопасность» (#/profile/security). */
const PROFILE_TABS = [["progress", "Прогресс"], ["personal", "Личные данные"], ["security", "Безопасность"]];
const TAB_TITLES = { progress: "Профиль", personal: "Личные данные", security: "Безопасность" };
const profileTab = () => {
  const m = location.hash.match(/^#\/profile\/(personal|security)/);
  return m ? m[1] : "progress";
};

function profileTabs() {
  const cur = profileTab();
  return `<div class="tabs ptabs" role="tablist" aria-label="Разделы профиля" data-active="${cur}" data-ptabs>
    ${PROFILE_TABS.map(([id, text]) => `<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${cur === id}" tabindex="${cur === id ? 0 : -1}" data-ptab="${id}">${text}</button>`).join("")}
  </div>`;
}

function showProfileTab(id) {
  const tabs = app.querySelector("[data-ptabs]");
  if (!tabs || tabs.dataset.active === id) return;
  tabs.dataset.active = id;
  tabs.querySelectorAll("[data-ptab]").forEach(b => {
    const on = b.dataset.ptab === id;
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  });
  app.querySelectorAll("[data-panel]").forEach(p => {
    const on = p.dataset.panel === id;
    p.hidden = !on;
    if (on) { p.classList.remove("enter"); void p.offsetWidth; p.classList.add("enter"); }
  });
  document.title = TAB_TITLES[id] + " · English";
}

function bindProfileTabs(main) {
  const tabs = main.querySelector("[data-ptabs]");
  if (!tabs) return;
  const go = id => {
    // A normal hash change: Back/Forward work, and route() switches the tab in place without reloading the stats.
    const hash = id === "progress" ? "#/profile" : `#/profile/${id}`;
    showProfileTab(id);
    if (location.hash !== hash) location.hash = hash;
  };
  tabs.querySelectorAll("[data-ptab]").forEach(b => b.addEventListener("click", () => go(b.dataset.ptab)));
  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  tabs.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const ids = PROFILE_TABS.map(t => t[0]), i = ids.indexOf(profileTab());
    const next = ids[(i + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
    go(next);
    tabs.querySelector(`[data-ptab="${next}"]`).focus();
  });
  if (profileTab() !== "progress") document.title = TAB_TITLES[profileTab()] + " · English";
}

function personalBlock() {
  const field = (id, text, attrs = "") => `<label class="field" for="${id}"><span>${text}</span>
      <input class="inp" id="${id}" ${attrs}>
    </label>`;
  return `<section class="card-block">
    <h2>Личные данные</h2>
    <p class="block-note">Все поля необязательны. Их видите вы, учителя и администратор, другие ученики не видят.</p>
    <form class="pw-form" novalidate data-personal-form aria-busy="true">
      ${field("pd-last", "Фамилия", 'autocomplete="family-name" maxlength="60" autocapitalize="words"')}
      ${field("pd-first", "Имя", 'autocomplete="given-name" maxlength="60" autocapitalize="words"')}
      ${field("pd-middle", "Отчество · если есть", 'autocomplete="additional-name" maxlength="60" autocapitalize="words"')}
      ${field("pd-phone", "Телефон", 'type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 (999) 123-45-67" maxlength="22"')}
      <button class="btn" type="submit" data-submit disabled>Сохранить</button>
      <p class="login-msg" aria-live="polite" data-pd-msg></p>
    </form>
  </section>`;
}

// Phone as you type: Russian numbers (+7, 8…, 9…) get the +7 (999) 123-45-67 mask; «+» with another code stays free-form.
function maskPhone(v) {
  let d = v.replace(/\D/g, "");
  if (!d) return v.trim().startsWith("+") ? "+" : "";
  const foreign = v.trim().startsWith("+") && d[0] !== "7";
  if (foreign) return "+" + d.slice(0, 15);
  if (d[0] === "8") d = "7" + d.slice(1);
  else if (d[0] === "9") d = "7" + d;
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 4) out += ")";
  if (d.length > 4) out += " " + d.slice(4, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  if (d.length > 9) out += "-" + d.slice(9, 11);
  return out;
}
// Russian numbers need all 11 digits; a foreign one (+ and a code other than 7) needs 10–15.
const phoneOk = v => {
  const d = v.replace(/\D/g, "");
  if (!d) return true;
  if (v.trim().startsWith("+") && d[0] !== "7") return d.length >= 10 && d.length <= 15;
  return d.length === 11;
};

async function bindPersonalBlock(main) {
  const form = main.querySelector("[data-personal-form]");
  if (!form) return;
  const f = { last_name: form.querySelector("#pd-last"), first_name: form.querySelector("#pd-first"), middle_name: form.querySelector("#pd-middle"), phone: form.querySelector("#pd-phone") };
  const btn = form.querySelector("[data-submit]"), msg = form.querySelector("[data-pd-msg]");
  const say = (text, info) => { msg.className = "login-msg" + (info ? " info" : ""); msg.textContent = text; if (text) { void msg.offsetWidth; msg.classList.add("show"); } };
  let saved = {};
  const values = () => ({ last_name: f.last_name.value.trim(), first_name: f.first_name.value.trim(), middle_name: f.middle_name.value.trim(), phone: f.phone.value.trim() });
  const dirty = () => JSON.stringify(values()) !== JSON.stringify(saved);
  const fill = d => {
    f.last_name.value = d.last_name || ""; f.first_name.value = d.first_name || ""; f.middle_name.value = d.middle_name || "";
    f.phone.value = d.phone ? fmtPhone(d.phone) : "";
    saved = values();
    btn.disabled = true;
  };
  // Show the name in the account block right away, without reloading.
  const paintName = d => {
    currentName = fullName(d);
    const nameEl = main.querySelector("[data-me-name]"), emailEl = main.querySelector("[data-me-email]");
    if (!nameEl) return;
    nameEl.textContent = currentName; nameEl.hidden = !currentName;
    emailEl.className = currentName ? "user-email" : "me-mail";
  };
  try {
    const d = await profile.get();
    if (!form.isConnected) return;
    fill(d); paintName(d);
  } catch (err) { if (err instanceof AuthRequired) { handleError(err); return; } say("Не удалось загрузить данные. Обновите страницу."); }
  form.removeAttribute("aria-busy");

  f.phone.addEventListener("input", () => {
    const before = f.phone.value;
    f.phone.value = maskPhone(before);
    // keep the caret at the end after reformatting (typing happens at the end almost always)
    f.phone.setSelectionRange(f.phone.value.length, f.phone.value.length);
  });
  form.addEventListener("input", () => { btn.disabled = !dirty(); say(""); });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const v = values();
    if (!phoneOk(v.phone)) { say("Проверьте номер: для России нужно 11 цифр, например +7 (999) 123-45-67. Номер другой страны вводите с «+» и кодом страны."); f.phone.focus(); return; }
    btn.disabled = true; btn.classList.add("loading");
    try {
      const d = await profile.save(v);
      fill(d); paintName(d);
      toast("Данные сохранены");
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      btn.disabled = false;
      say(/bad phone/i.test(err?.message || "") ? "Проверьте номер телефона." : /too long/i.test(err?.message || "") ? "Слишком длинно: не больше 60 символов в поле." : "Не удалось сохранить. Попробуйте ещё раз.");
    } finally { btn.classList.remove("loading"); }
  });
}

function passwordBlock() {
  const field = (id, text, ac) => `<label class="field" for="${id}"><span>${text}</span>
      <span class="pw">
        <input class="inp" id="${id}" type="password" autocomplete="${ac}" minlength="6" required>
        <button type="button" class="pw-toggle" aria-label="Показать пароль" data-pw>Показать</button>
      </span>
    </label>`;
  return `<section class="card-block">
    <h2>Сменить пароль</h2>
    <form class="pw-form" novalidate data-pw-form>
      <input type="email" autocomplete="username" value="${esc(currentEmail)}" hidden readonly>
      ${field("cur-password", "Текущий пароль", "current-password")}
      ${field("chg-password", "Новый пароль · минимум 6 символов", "new-password")}
      ${field("chg-password-2", "Повторите новый пароль", "new-password")}
      <button class="btn" type="submit" data-submit>Сохранить пароль</button>
      <p class="login-msg" aria-live="polite" data-pw-msg></p>
    </form>
  </section>`;
}

function bindPasswordBlock(main) {
  const form = main.querySelector("[data-pw-form]");
  if (!form) return;
  bindPasswordToggles(form);
  const cur = form.querySelector("#cur-password"), p1 = form.querySelector("#chg-password"), p2 = form.querySelector("#chg-password-2");
  const btn = form.querySelector("[data-submit]"), msg = form.querySelector("[data-pw-msg]");
  const fail = (text, input) => {
    msg.textContent = text; msg.classList.remove("show"); void msg.offsetWidth; msg.classList.add("show");
    input?.focus();
  };
  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.textContent = "";
    if (!cur.value) return fail("Введите текущий пароль.", cur);
    if (p1.value.length < 6) return fail("Новый пароль — минимум 6 символов.", p1);
    if (p1.value !== p2.value) return fail("Пароли не совпадают.", p2);
    if (p1.value === cur.value) return fail("Новый пароль совпадает с текущим. Придумайте другой.", p1);
    btn.disabled = true; btn.classList.add("loading");
    try {
      await auth.changePassword(currentEmail, cur.value, p1.value);
      form.reset();
      form.querySelectorAll("input[type=text]").forEach(i => { i.type = "password"; });
      form.querySelectorAll("[data-pw]").forEach(b => { b.textContent = "Показать"; b.setAttribute("aria-label", "Показать пароль"); });
      toast("Пароль обновлён");
    } catch (err) {
      fail(authMessage(err), /Текущий/.test(authMessage(err)) ? cur : null);
    } finally { btn.disabled = false; btn.classList.remove("loading"); }
  });
}

async function renderProfile() {
  removeFloating();
  document.title = "Профиль · English";
  const token = ++screenToken;
  const saved = cache.get("profile");
  if (saved) { paintProfile(saved, false); window.scrollTo(0, 0); }
  else {
    app.innerHTML = topbar(true) + `
    <main class="wrap" aria-busy="true">
      <div class="skel-wrap" aria-label="Загружаю профиль">
        <div class="skel line" style="width:30%"></div><div class="skel title"></div>
        <div class="skel-row3"><div class="skel row"></div><div class="skel row"></div><div class="skel row"></div></div>
        <div class="skel card"></div><div class="skel card"></div>
      </div>
    </main>`;
    bindTopbar();
    window.scrollTo(0, 0);
  }
  fillWordsLine();
  try {
    const lessons = await api.profileStats();
    if (token !== screenToken) return;
    const same = saved && JSON.stringify(saved) === JSON.stringify(lessons);
    cache.set("profile", lessons);
    if (!saved) paintProfile(lessons, false);
    // «Личные данные» and «Безопасность» hold forms, so they are never redrawn under the person's hands.
    else if (!same && profileTab() === "progress" && !busyEditing()) repaint(paintProfile, lessons);
  } catch (err) {
    if (!saved) handleError(err);
  }
}

// Three tiles, the course bar and the solved-tasks line: the same on «Ваш прогресс» and on a student's page.
function progressSummary({ done, total, firstTry, mistakes, words = "" }) {
  const coursePct = pct(done, total);
  return `<section class="summary" aria-label="Общий прогресс">
      <div class="stat"><b><span data-count="${coursePct}" data-suffix="%">${coursePct}%</span></b><span>курса пройдено</span></div>
      <div class="stat"><b>${done ? `<span data-count="${firstTry}" data-suffix="%">${firstTry}%</span>` : "—"}</b><span>с первой попытки</span></div>
      <div class="stat${mistakes ? " warn" : ""}"><b><span data-count="${mistakes}">${mistakes}</span></b><span>ошибок ждут повторения</span></div>
    </section>
    <div class="bar big" aria-label="Пройдено ${coursePct}%"><i data-pct="${coursePct}"></i></div>
    <p class="hint-line">Решено ${done} ${plural(done, "задание", "задания", "заданий")} из ${total}${words}</p>`;
}

function paintProfile(lessons, silent) {

    const { done, total, ok, mistakes, weakAll, strong } = summarize(lessons);
    const weak = weakAll.slice(0, 5);
    const weakRest = weakAll.slice(5);
    const weakMistakes = weakAll.reduce((n, t) => n + t.mistakes, 0);
    const shownMistakes = weak.reduce((n, t) => n + t.mistakes, 0);
    // «Продолжите» works exactly like «Продолжить» on the lessons list: the first topic with unsolved
    // items inside the first lesson that is started but not finished.
    const inProgress = lessons.find(l => (l.sections || []).some(s => s.done) && (l.sections || []).some(s => s.done < s.total)) || null;
    const nextSection = inProgress ? (inProgress.sections || []).find(s => s.done < s.total) : null;
    const nextTopic = nextSection ? { ...nextSection, slug: inProgress.slug, lessonTitle: inProgress.title } : null;
    const nextLesson = lessons.find(l => (l.sections || []).every(s => !s.done)) || null;
    const worst = lessons.filter(l => (l.sections || []).some(s => s.mistakes))
      .sort((a, b) => b.sections.reduce((x, s) => x + s.mistakes, 0) - a.sections.reduce((x, s) => x + s.mistakes, 0))[0] || null;
    const linkTo = (slug, target, text) => `<a href="#/lesson/${encodeURIComponent(slug)}${target ? `?t=${encodeURIComponent(target)}` : ""}">${text}</a>`;
    const coursePct = pct(done, total);
    const firstTry = pct(ok, done);

    const plan = [];
    if (mistakes) plan.push(`Разберите ошибки: их накопилось <b>${mistakes}</b>.${worst ? ` Больше всего в уроке «${esc(worst.title)}» — ${linkTo(worst.slug, "review", "открыть «Мои ошибки»")}.` : ""} Задание уходит из списка, когда вы решите его с первого раза.`);
    if (weak.length) plan.push(`Повторите тему ${linkTo(weak[0].slug, weak[0].id, `<b>${esc(weak[0].nav)}</b>`)} из урока «${esc(weak[0].lessonTitle)}». ${esc(LESSON_GOALS[weak[0].slug] ? "Она нужна, чтобы " + LESSON_GOALS[weak[0].slug] + "." : "")}`);
    if (nextTopic) plan.push(`Продолжите урок «${esc(nextTopic.lessonTitle)}», тема ${linkTo(nextTopic.slug, nextTopic.id, `<b>${esc(nextTopic.nav)}</b>`)}: осталось ${nextTopic.total - nextTopic.done} ${plural(nextTopic.total - nextTopic.done, "задание", "задания", "заданий")}.`);
    else if (nextLesson) plan.push(`Начните урок ${linkTo(nextLesson.slug, "", `«<b>${esc(nextLesson.title)}</b>»`)}. ${esc(LESSON_GOALS[nextLesson.slug] ? "После него вы сможете " + LESSON_GOALS[nextLesson.slug] + "." : "")}`);
    if (!plan.length) plan.push("Вы прошли всё, что есть в курсе, и почти без ошибок. Возвращайтесь к контрольным раз в неделю, чтобы не забывать.");

    const readiness = done < 40
      ? "Пока рано судить: решите хотя бы пару тем, и здесь появится оценка."
      : coursePct >= 80 && firstTry >= 80
        ? "Грамматика и слова уровня A1 у вас в хорошей форме. Для теста осталось потренировать аудирование и разговор."
        : coursePct >= 50
          ? "Основа A1 заложена. До теста стоит закрыть слабые темы из списка выше и пройти контрольные."
          : "Вы в начале пути. Пройдите уроки по порядку: каждая следующая тема опирается на предыдущую.";

    app.innerHTML = topbar(true) + `
      <main class="wrap">
        ${accountBlock()}
        ${profileTabs()}
        <div class="ptab-panel" id="panel-progress" role="tabpanel" aria-labelledby="tab-progress" data-panel="progress"${profileTab() === "progress" ? "" : " hidden"}>
        <header class="hero">
          <p class="kicker">Профиль</p>
          <h1>Ваш прогресс</h1>
          <p class="lead">Что уже получается, где чаще всего ошибки и что стоит повторить в первую очередь.</p>
        </header>

        ${progressSummary({ done, total, firstTry, mistakes, words: `<span data-words-line>${wordsNote(cache.get("wordstats"), "#/words")}</span>` })}

        <section class="card-block">
          <p class="eyebrow">Ваш план</p>
          <h2>С чего начать сегодня</h2>
          <ol class="plan">${plan.map(x => `<li><span>${x}</span></li>`).join("")}</ol>
        </section>

        ${weakAll.length ? `<section class="card-block">
          <p class="eyebrow">Слабые места</p>
          <h2>Стоит подтянуть</h2>
          <p class="block-note">Темы, где ответы чаще были со второй попытки или с подсказкой.${weakAll.length > weak.length
            ? ` Показаны ${weak.length} из ${weakAll.length}: в них ${shownMistakes} ${plural(shownMistakes, "ошибка", "ошибки", "ошибок")} из ${weakMistakes}.`
            : ""}</p>
          <ul class="topics">${weak.map(t => topicRow(t, "weak")).join("")}</ul>
          ${weakRest.length ? `<details class="about">
            <summary>Ещё ${weakRest.length} ${plural(weakRest.length, "тема", "темы", "тем")} для повторения</summary>
            <ul class="topics rest">${weakRest.map(t => topicRow(t, "weak")).join("")}</ul>
          </details>` : ""}
        </section>` : ""}

        ${strong.length ? `<section class="card-block">
          <p class="eyebrow">Сильные стороны</p>
          <h2>Получается хорошо</h2>
          <p class="block-note">Здесь почти все ответы были верными сразу.</p>
          <ul class="topics">${strong.map(t => topicRow(t, "strong")).join("")}</ul>
        </section>` : ""}

        <section class="card-block">
          <p class="eyebrow">Уровень</p>
          <h2>A1: зачем он нужен</h2>
          <p class="block-note">${esc(readiness)}</p>
          <details class="about">
            <summary>${esc(LEVEL.title)}</summary>
            ${LEVEL.what.map(x => `<p class="about-note">${esc(x)}</p>`).join("")}
          </details>
          <details class="about">
            <summary>Что даёт этот уровень</summary>
            <ul class="outcomes plain">${LEVEL.gives.map(x => `<li><span>${esc(x)}</span></li>`).join("")}</ul>
          </details>
          <details class="about">
            <summary>Если хотите сдавать международный тест</summary>
            ${LEVEL.exams.map(x => `<p class="about-note">${esc(x)}</p>`).join("")}
          </details>
          <details class="about">
            <summary>Чего в курсе пока нет</summary>
            <ul class="outcomes plain">${LEVEL.missing.map(x => `<li><span>${esc(x)}</span></li>`).join("")}</ul>
            <p class="about-note">${esc(COURSE.next)}</p>
          </details>
        </section>
        </div>

        <div class="ptab-panel" id="panel-personal" role="tabpanel" aria-labelledby="tab-personal" data-panel="personal"${profileTab() === "personal" ? "" : " hidden"}>
          ${personalBlock()}
        </div>

        <div class="ptab-panel" id="panel-security" role="tabpanel" aria-labelledby="tab-security" data-panel="security"${profileTab() === "security" ? "" : " hidden"}>
          ${passwordBlock()}
        </div>

        <p class="back-line"><a class="back" href="#/">← Все уроки</a></p>

        <footer class="author">
          <div class="author-left">
            <img class="author-photo" src="${AUTHOR.photo}" alt="" width="64" height="64" loading="lazy">
            <div>
              <p class="eyebrow">${esc(AUTHOR.label)}</p>
              <p class="author-contact"><a href="mailto:${esc(AUTHOR.email)}">${esc(AUTHOR.email)}</a></p>
              <p class="author-contact">Telegram: <a href="https://t.me/${esc(AUTHOR.telegram.replace("@", ""))}" target="_blank" rel="noopener">${esc(AUTHOR.telegram)}</a></p>
            </div>
          </div>
          <div class="author-right">
            <p class="author-brand">${esc(AUTHOR.brand)}</p>
            <p class="author-tagline">${esc(AUTHOR.tagline)}</p>
          </div>
        </footer>
      </main>`;
    bindTopbar();
    const main = app.querySelector("main");
    main.classList.add("screen");
    if (!silent) {
      stagger(main.querySelector(".hero"));
      stagger(main.querySelector(".summary"));
    }
    bindAccountBlock(main);
    bindProfileTabs(main);
    bindPersonalBlock(main);
    bindPasswordBlock(main);
    if (!silent) countUp(main);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      main.querySelectorAll(".bar i[data-pct]").forEach(b => { b.style.width = b.dataset.pct + "%"; });
    }));
}

/* ---------- users (admin only): give and take the teacher role ---------- */
const fmtDate = iso => (iso ? new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "");

// «16 сент.»; the year only when it is not the current one.
const fmtShort = iso => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", ...(d.getFullYear() !== new Date().getFullYear() ? { year: "2-digit" } : {}) });
};

// One user = one table row on a computer; on a phone the same cells wrap into a compact two-line row.
function userRow(u) {
  const ava = u.avatar_url
    ? `<img src="${esc(u.avatar_url)}" alt="" loading="lazy" decoding="async">`
    : esc(((u.first_name || u.email || "?")[0]).toUpperCase());
  const id = `teacher-${u.id}`;
  const phone = u.phone ? esc(fmtPhone(u.phone)) : "";
  const since = fmtShort(u.created_at), seen = u.last_sign_in_at ? fmtShort(u.last_sign_in_at) : "";
  return `<li class="user-row">
    <div class="u-person">
      <span class="me-ava user-ava${u.avatar_url ? " has-photo" : ""}" aria-hidden="true">${ava}</span>
      <div class="user-main">
        <p class="user-mail">${esc(displayName(u))}${u.is_admin ? ` <span class="role-badge">Админ</span>` : ""}</p>
        ${fullName(u) ? `<p class="user-email">${esc(u.email || "")}</p>` : ""}
        <p class="u-meta-m">${[phone, seen ? `вход ${seen}` : "ещё не входил(а)"].filter(Boolean).join(" · ")}</p>
      </div>
    </div>
    <p class="u-cell u-phone">${phone || `<span class="u-none">—</span>`}</p>
    <p class="u-cell"><time datetime="${esc(u.created_at || "")}" title="${esc(fmtDate(u.created_at))}">${since}</time></p>
    <p class="u-cell">${seen ? `<time datetime="${esc(u.last_sign_in_at)}" title="${esc(fmtDate(u.last_sign_in_at))}">${seen}</time>` : `<span class="u-none">—</span>`}</p>
    <label class="switch" for="${id}" title="${u.is_admin ? "Админ всегда учитель" : "Роль «Учитель»"}">
      <span class="switch-text">Учитель</span>
      <input type="checkbox" role="switch" id="${id}" data-teacher="${esc(u.id)}" data-email="${esc(displayName(u))}"${u.is_teacher || u.is_admin ? " checked" : ""}${u.is_admin ? " disabled" : ""}>
      <span class="switch-track" aria-hidden="true"><i></i></span>
    </label>
  </li>`;
}

// Search + «Показать ещё» for the users and students lists. The server filters and pages;
// the query is kept in the URL (?q=) so Back from a student returns to the same search.
const PAGE = 20;
const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>';
const hashQuery = () => new URLSearchParams(location.hash.split("?")[1] || "").get("q") || "";

// columns: table headings — the list is then drawn as a table (the «Пользователи» screen).
function pagedListHtml(label, columns = null) {
  const list = columns
    ? `<div class="users-table"><div class="u-head" aria-hidden="true">${columns.map(c => `<span>${c}</span>`).join("")}</div><ul class="users users-rows" data-list></ul></div>`
    : `<ul class="users" data-list></ul>`;
  return `<label class="search" for="list-search">
      <span class="search-ico">${SEARCH_ICON}</span>
      <input class="inp" id="list-search" type="search" placeholder="${label}" aria-label="${label}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" value="${esc(hashQuery())}" data-search>
    </label>
    <p class="hint-line" aria-live="polite" data-count></p>
    ${list}
    <p class="empty" data-empty hidden></p>
    <div class="more-line"><button type="button" class="btn quiet" data-more hidden>Показать ещё</button></div>`;
}

function mountPagedList(main, { base, load, row, countText, emptyText, noMatchText, onPage }) {
  const input = main.querySelector("[data-search]"), list = main.querySelector("[data-list]");
  const count = main.querySelector("[data-count]"), empty = main.querySelector("[data-empty]"), more = main.querySelector("[data-more]");
  let query = input.value.trim(), loaded = 0, total = 0, req = 0, timer = 0;

  const fetchPage = async reset => {
    const my = ++req;
    if (reset) list.classList.add("dim");
    else { more.disabled = true; more.classList.add("loading"); }
    try {
      const data = await load(query, reset ? 0 : loaded);
      if (my !== req || !list.isConnected) return; // a newer search has started or the screen was left
      const items = data.items || [];
      total = data.total || 0;
      if (reset) { list.innerHTML = ""; loaded = 0; }
      const start = list.children.length;
      list.insertAdjacentHTML("beforeend", items.map(row).join(""));
      const fresh = [...list.children].slice(start);
      fresh.forEach((li, i) => { li.classList.add("rise-in"); li.style.setProperty("--i", Math.min(i, 8)); });
      loaded += items.length;
      count.textContent = countText(total, query, data);
      empty.hidden = total > 0;
      empty.textContent = query ? noMatchText(query) : emptyText;
      more.hidden = loaded >= total;
      onPage?.(fresh, data);
    } catch (err) {
      if (my !== req) return;
      if (err instanceof AuthRequired) { handleError(err); return; }
      toast("Не удалось загрузить список. Проверьте интернет.");
    } finally {
      if (my === req) { list.classList.remove("dim"); more.disabled = false; more.classList.remove("loading"); }
    }
  };

  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const q = input.value.trim();
      if (q === query) return;
      query = q;
      history.replaceState(null, "", location.pathname + location.search + base + (q ? `?q=${encodeURIComponent(q)}` : ""));
      fetchPage(true);
    }, 300);
  });
  input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); input.blur(); } });
  more.addEventListener("click", () => fetchPage(false));
  return fetchPage(true);
}

async function renderUsers() {
  removeFloating();
  document.title = "Пользователи · English";
  if (currentRole !== "admin") {
    app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Этот раздел доступен только администратору.</p><p class="back-line"><a class="back" href="#/">← Все уроки</a></p></main>`;
    bindTopbar();
    return;
  }
  app.innerHTML = topbar(true) + `
    <main class="wrap screen">
      <header class="hero">
        <p class="kicker">Администрирование</p>
        <h1>Пользователи</h1>
        <p class="lead">Включите «Учитель», чтобы человек видел прогресс учеников. Выключите, чтобы забрать роль.</p>
      </header>
      ${pagedListHtml("Поиск по имени, почте или телефону", ["Пользователь", "Телефон", "С нами", "Вход", "Учитель"])}
      <p class="back-line"><a class="back" href="#/">← Все уроки</a></p>
    </main>`;
  bindTopbar();
  window.scrollTo(0, 0);
  const main = app.querySelector("main");
  let users = 0, teachers = 0;
  const countText = (total, q) => q
    ? `Найдено: ${total}`
    : `${users} ${plural(users, "пользователь", "пользователя", "пользователей")}, из них учителей: ${teachers}`;
  const count = main.querySelector("[data-count]");
  await mountPagedList(main, {
    base: "#/users",
    load: (q, offset) => roles.listUsers(q, PAGE, offset),
    row: userRow,
    countText: (total, q, data) => { users = data.users || 0; teachers = data.teachers || 0; return countText(total, q); },
    emptyText: "Пока никто не зарегистрировался.",
    noMatchText: q => `Никого не нашли по запросу «${q}».`,
  });
  // One listener for all rows, including the ones «Показать ещё» adds later.
  main.querySelector("[data-list]").addEventListener("change", async e => {
    const input = e.target.closest("[data-teacher]");
    if (!input) return;
    const on = input.checked;
    const sw = input.closest(".switch");
    input.disabled = true;
    sw.classList.add("saving");
    try {
      await roles.setTeacher(input.dataset.teacher, on);
      teachers += on ? 1 : -1;
      if (!main.querySelector("[data-search]").value.trim()) count.textContent = countText(0, "");
      toast(on ? `${input.dataset.email} теперь учитель` : `${input.dataset.email} больше не учитель`);
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      input.checked = !on;
      toast("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      input.disabled = false;
      sw.classList.remove("saving");
    }
  });
}

/* ---------- students (teachers and the admin) ---------- */
const isTeacher = () => currentRole === "admin" || currentRole === "teacher";

function studentRow(u) {
  const ava = u.avatar_url
    ? `<img src="${esc(u.avatar_url)}" alt="" loading="lazy" decoding="async">`
    : esc((u.email?.[0] || "?").toUpperCase());
  const course = pct(u.done, u.total), firstTry = pct(u.ok, u.done);
  const last = u.last_activity ? `последнее занятие ${fmtDate(u.last_activity)}` : "ещё не начинал(а) уроки";
  return `<li><a class="student-row" href="#/students/${encodeURIComponent(u.id)}">
    <div class="student-head">
      <span class="me-ava user-ava${u.avatar_url ? " has-photo" : ""}" aria-hidden="true">${ava}</span>
      <div class="user-main">
        ${nameLines(u)}
        <p class="user-meta">${u.is_teacher ? `<span class="role-badge">Учитель</span> ` : ""}${last}</p>
      </div>
    </div>
    <div class="student-progress">
      <div class="bar" aria-hidden="true"><i data-pct="${course}"></i></div>
      <p class="student-pct" aria-label="Курс пройден на ${course}%">${course}%</p>
    </div>
    <p class="topic-meta"><span>решено ${u.done} из ${u.total}</span>${u.done ? `<span>с первой попытки ${firstTry}%</span>` : ""}${u.mistakes ? `<span class="m">ошибок: ${u.mistakes}</span>` : ""}</p>
  </a></li>`;
}

async function renderStudents() {
  removeFloating();
  document.title = "Ученики · English";
  if (!isTeacher()) {
    app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Этот раздел доступен только учителям.</p><p class="back-line"><a class="back" href="#/">← Все уроки</a></p></main>`;
    bindTopbar();
    return;
  }
  app.innerHTML = topbar(true) + `
    <main class="wrap screen">
      <header class="hero">
        <p class="kicker">Для учителя</p>
        <h1>Ученики</h1>
        <p class="lead">Прогресс всех участников курса. Сверху те, кто занимался недавно.</p>
      </header>
      ${pagedListHtml("Поиск по имени, почте или телефону")}
      <p class="back-line"><a class="back" href="#/">← Все уроки</a></p>
    </main>`;
  bindTopbar();
  window.scrollTo(0, 0);
  const main = app.querySelector("main");
  main.querySelector("[data-list]").classList.add("students");
  await mountPagedList(main, {
    base: "#/students",
    load: (q, offset) => roles.listStudents(q, PAGE, offset),
    row: studentRow,
    countText: (total, q) => q ? `Найдено: ${total}` : `${total} ${plural(total, "участник", "участника", "участников")}`,
    emptyText: "Пока никто, кроме вас, не зарегистрировался.",
    noMatchText: q => `Никого не нашли по запросу «${q}».`,
    onPage: fresh => requestAnimationFrame(() => requestAnimationFrame(() => {
      fresh.forEach(li => li.querySelectorAll(".bar i[data-pct]").forEach(b => { b.style.width = b.dataset.pct + "%"; }));
    })),
  });
}

async function renderStudent(id) {
  removeFloating();
  document.title = "Ученик · English";
  if (!isTeacher()) {
    app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Этот раздел доступен только учителям.</p><p class="back-line"><a class="back" href="#/">← Все уроки</a></p></main>`;
    bindTopbar();
    return;
  }
  app.innerHTML = topbar(true) + `
    <main class="wrap" aria-busy="true">
      <div class="skel-wrap" aria-label="Загружаю прогресс ученика">
        <div class="skel line" style="width:30%"></div><div class="skel title"></div>
        <div class="skel-row3"><div class="skel row"></div><div class="skel row"></div><div class="skel row"></div></div>
        <div class="skel card"></div><div class="skel card"></div>
      </div>
    </main>`;
  bindTopbar();
  window.scrollTo(0, 0);
  let st;
  try { st = await roles.studentStats(id); }
  catch (err) {
    if (err?.message === "not_found") {
      app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Такого ученика нет: возможно, аккаунт удалён.</p><p class="back-line"><a class="back" href="#/students">← Все ученики</a></p></main>`;
      bindTopbar();
      return;
    }
    handleError(err); return;
  }
  const { done, total, ok, mistakes, weakAll, strong } = summarize(st.lessons || []);
  const weak = weakAll.slice(0, 5), weakRest = weakAll.slice(5);
  const coursePct = pct(done, total), firstTry = pct(ok, done);
  const ava = st.avatar_url ? `<img src="${esc(st.avatar_url)}" alt="" decoding="async">` : esc((st.email?.[0] || "?").toUpperCase());
  const last = st.last_activity ? `Последнее занятие ${fmtDate(st.last_activity)}` : "Ещё не начинал(а) уроки";
  document.title = `${displayName(st)} · Ученики · English`;
  app.innerHTML = topbar(true) + `
    <main class="wrap screen">
      <p class="crumbs"><a class="back" href="#/students">← Все ученики</a></p>
      <section class="me" aria-label="Ученик">
        <span class="me-ava${st.avatar_url ? " has-photo" : ""}" aria-hidden="true">${ava}</span>
        <div class="me-main">
          ${[st.last_name, st.first_name, st.middle_name].some(Boolean) ? `<p class="me-mail">${esc([st.last_name, st.first_name, st.middle_name].filter(Boolean).join(" "))}</p><p class="user-email">${esc(st.email || "")}</p>` : `<p class="me-mail">${esc(st.email || "")}</p>`}
          ${st.phone ? `<p class="user-meta"><a class="tel" href="tel:${esc(st.phone)}">${esc(fmtPhone(st.phone))}</a></p>` : ""}
          <p class="user-meta">${st.is_teacher ? `<span class="role-badge">Учитель</span> ` : ""}${last} · с нами с ${fmtDate(st.created_at)}</p>
          <div class="me-actions"><a class="btn ghost write-btn" href="#/chat/${encodeURIComponent(st.id)}">${CHAT_ICON}Написать</a></div>
        </div>
      </section>

      <div style="margin-top:24px">${progressSummary({ done, total, firstTry, mistakes, words: wordsNote({ total: st.words_total, learned: st.words_learned }) })}</div>

      ${weakAll.length ? `<section class="card-block">
        <p class="eyebrow">Слабые места</p>
        <h2>Стоит подтянуть</h2>
        <p class="block-note">Темы, где ответы чаще были со второй попытки или с подсказкой.</p>
        <ul class="topics">${weak.map(t => topicRow(t, "weak", false)).join("")}</ul>
        ${weakRest.length ? `<details class="about">
          <summary>Ещё ${weakRest.length} ${plural(weakRest.length, "тема", "темы", "тем")} для повторения</summary>
          <ul class="topics rest">${weakRest.map(t => topicRow(t, "weak", false)).join("")}</ul>
        </details>` : ""}
      </section>` : ""}

      ${strong.length ? `<section class="card-block">
        <p class="eyebrow">Сильные стороны</p>
        <h2>Получается хорошо</h2>
        <p class="block-note">Здесь почти все ответы были верными сразу.</p>
        <ul class="topics">${strong.map(t => topicRow(t, "strong", false)).join("")}</ul>
      </section>` : ""}

      ${!weakAll.length && !strong.length ? `<p class="empty">${done ? "Пока мало ответов, чтобы судить о сильных и слабых темах." : "Ученик ещё не решал задания."}</p>` : ""}

      <p class="back-line"><a class="back" href="#/students">← Все ученики</a></p>
    </main>`;
  bindTopbar();
  const main = app.querySelector("main");
  stagger(main.querySelector(".summary"));
  countUp(main);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    main.querySelectorAll(".bar i[data-pct]").forEach(b => { b.style.width = b.dataset.pct + "%"; });
  }));
}

/* ---------- chat ---------- */
const CHAT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>';
const SEND_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/></svg>';
const CHAT_MAX = 2000, CHAT_POLL = 5000;
const fmtTime = iso => new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
const dayKey = iso => new Date(iso).toDateString();
function dayLabel(iso) {
  const d = new Date(iso), today = new Date(), y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Сегодня";
  if (d.toDateString() === y.toDateString()) return "Вчера";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", ...(d.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}) });
}
function chatError(err) {
  const t = err?.message || "";
  if (/too many/i.test(t)) return "Слишком много сообщений подряд. Подождите минуту.";
  if (/too long/i.test(t)) return `Сообщение длиннее ${CHAT_MAX} символов.`;
  if (/fetch|network/i.test(t)) return "Нет связи с сервером. Проверьте интернет.";
  return "Не удалось отправить. Попробуйте ещё раз.";
}

function bubbleHtml(m) {
  const state = m.pending ? "Отправляется…" : m.failed ? "" : m.mine ? (m.read_at ? "Прочитано" : "Доставлено") : "";
  return `<li class="msg${m.mine ? " mine" : ""}${m.pending ? " pending" : ""}${m.failed ? " failed" : ""}" data-id="${m.id}" data-day="${dayKey(m.created_at)}">
    <div class="bubble-row">
      ${m.mine && !m.pending && !m.failed ? `<button type="button" class="msg-del" aria-label="Стереть сообщение" title="Стереть сообщение" data-del>${TRASH_ICON}</button>` : ""}
      <div class="bubble${m.image_path || m.local_image ? " has-image" : ""}">${m.image_path || m.local_image ? `<button type="button" class="msg-img" aria-label="Открыть фото" data-img="${esc(m.image_path || "")}">
          <img alt="Фото" decoding="async"${m.local_image ? ` src="${m.local_image}"` : ""}${chatImageUrls.get(m.image_path) ? ` src="${esc(chatImageUrls.get(m.image_path))}"` : ""}>
        </button>` : ""}${m.body ? `<p class="msg-text">${esc(m.body)}</p>` : ""}
        <p class="msg-meta"><time datetime="${esc(m.created_at)}">${fmtTime(m.created_at)}</time>${state ? `<span data-state>${state}</span>` : ""}</p>
      </div>
    </div>
    ${m.failed ? `<button type="button" class="inline-link msg-retry" data-retry>Не отправилось. Повторить</button>` : ""}
  </li>`;
}
const chatImageUrls = new Map(); // path -> signed URL (valid for an hour; kept for the session)
const CLIP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.5l-8.3 8.3a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

// Shrink a photo to at most 1600 px on the long side, JPEG — text on a notebook page stays readable.
async function chatJpeg(file, max = 1600) {
  let img;
  try { img = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch {
    img = new Image();
    const url = URL.createObjectURL(file);
    try { img.src = url; await img.decode(); } finally { URL.revokeObjectURL(url); }
  }
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * k), h = Math.round(img.height * k);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((ok, bad) => canvas.toBlob(b => (b ? ok(b) : bad(new Error("encode"))), "image/jpeg", 0.82));
}

// Full-screen photo: dark backdrop, closes with ✕, Esc or a tap outside the photo.
function openViewer(src) {
  const opener = document.activeElement;
  const v = document.createElement("div");
  v.className = "viewer"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", "Фото");
  v.innerHTML = `<img src="${esc(src)}" alt="Фото"><button type="button" class="viewer-close" aria-label="Закрыть">${CLOSE_ICON}</button>`;
  const close = () => {
    document.removeEventListener("keydown", onKey);
    v.classList.add("out");
    setTimeout(() => v.remove(), reduced() ? 0 : 180);
    document.documentElement.classList.remove("no-scroll");
    opener?.focus?.({ preventScroll: true });
  };
  const onKey = e => { if (e.key === "Escape") close(); };
  v.addEventListener("click", e => { if (e.target.tagName !== "IMG") close(); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(v);
  document.documentElement.classList.add("no-scroll");
  v.querySelector(".viewer-close").focus({ preventScroll: true });
}

const MORE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';

async function renderChat(withId) {
  removeFloating();
  document.title = "Сообщения · English";
  app.innerHTML = topbar(true) + `
    <main class="wrap" aria-busy="true">
      <div class="skel-wrap" aria-label="Загружаю переписку">
        <div class="skel line" style="width:30%"></div><div class="skel card"></div><div class="skel card"></div>
      </div>
    </main>`;
  bindTopbar();
  let data;
  try { data = await messages.get(withId); }
  catch (err) {
    if (err instanceof AuthRequired) { handleError(err); return; }
    app.innerHTML = topbar(true) + `<main class="wrap screen"><p class="empty">Эта переписка недоступна.</p><p class="back-line"><a class="back" href="#/">← Все уроки</a></p></main>`;
    bindTopbar();
    return;
  }
  const other = data.with || {};
  // Back to the student's page when the chat was opened from it, otherwise to the list of dialogs.
  const backHref = prevHash.startsWith("#/students/") ? prevHash : "#/messages";
  const ava = other.avatar_url ? `<img src="${esc(other.avatar_url)}" alt="" decoding="async">` : esc((other.email?.[0] || "?").toUpperCase());
  document.title = `${displayName(other)} · Сообщения · English`;
  app.innerHTML = topbar(true) + `
    <main class="wrap chat">
      <header class="chat-head">
        <a class="back" href="${backHref}" aria-label="Назад">←</a>
        <span class="me-ava user-ava${other.avatar_url ? " has-photo" : ""}" aria-hidden="true">${ava}</span>
        <div class="chat-who"><p class="chat-with">${esc(displayName(other))}</p>${fullName(other) ? `<p class="user-email">${esc(other.email || "")}</p>` : ""}</div>
        <div class="chat-menu">
          <button type="button" class="icon-btn chat-more" aria-label="Действия с чатом" title="Действия с чатом" aria-haspopup="dialog" aria-expanded="false" data-chat-more>${MORE_ICON}</button>
          <div class="acct-pop chat-pop" role="dialog" aria-label="Действия с чатом" hidden data-chat-pop></div>
        </div>
      </header>
      <div class="more-line chat-older"><button type="button" class="btn quiet" data-older hidden>Показать более ранние</button></div>
      <ol class="msgs" aria-live="polite" aria-label="Сообщения" data-msgs></ol>
      <p class="empty chat-empty" data-empty hidden>Сообщений пока нет. Напишите первое.</p>
      ${data.can_write ? `<form class="composer" data-composer>
        <div class="attach-preview" data-preview hidden>
          <img alt="Выбранное фото" data-preview-img>
          <button type="button" class="attach-remove" aria-label="Убрать фото" title="Убрать фото" data-preview-remove>${CLOSE_ICON}</button>
        </div>
        <label class="attach-btn" title="Прикрепить фото">
          <input type="file" accept="image/*" class="visually-hidden" aria-label="Прикрепить фото" data-attach>
          ${CLIP_ICON}
        </label>
        <label class="visually-hidden" for="chat-input">Сообщение</label>
        <textarea class="inp" id="chat-input" rows="1" maxlength="${CHAT_MAX}" placeholder="Сообщение" enterkeyhint="send"></textarea>
        <button class="send-btn" type="submit" aria-label="Отправить" title="Отправить" disabled>${SEND_ICON}</button>
        <p class="composer-note" aria-live="polite" data-note></p>
      </form>` : ""}
    </main>`;
  bindTopbar();
  const main = app.querySelector("main");
  main.classList.add("screen");
  const list = main.querySelector("[data-msgs]"), empty = main.querySelector("[data-empty]"), older = main.querySelector("[data-older]");
  const form = main.querySelector("[data-composer]");
  const known = new Map(); // id -> message, to update «Прочитано» and skip duplicates
  let oldest = null, newest = 0, pendingSeq = 0;

  const nearBottom = () => innerHeight + scrollY >= document.documentElement.scrollHeight - 120;
  const toBottom = smooth => scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth && !reduced() ? "smooth" : "auto" });
  // Day separators: one before the first message of every day.
  const fixDays = () => {
    list.querySelectorAll(".day-sep").forEach(d => d.remove());
    let prev = "";
    list.querySelectorAll(".msg").forEach(li => {
      if (li.dataset.day !== prev) {
        const t = li.querySelector("time")?.getAttribute("datetime");
        li.insertAdjacentHTML("beforebegin", `<li class="day-sep" aria-hidden="true"><span>${dayLabel(t)}</span></li>`);
        prev = li.dataset.day;
      }
    });
    empty.hidden = !!list.querySelector(".msg");
  };
  // Fetch signed links for photos that have none yet and put them into the bubbles.
  const loadImages = async () => {
    const need = [...list.querySelectorAll("img:not([src])")].map(i => i.closest("[data-img]")?.dataset.img).filter(p => p && !chatImageUrls.has(p));
    if (need.length) {
      try { Object.entries(await messages.imageUrls([...new Set(need)])).forEach(([p, u]) => chatImageUrls.set(p, u)); } catch {}
    }
    list.querySelectorAll("[data-img]").forEach(b => {
      const img = b.querySelector("img"), u = chatImageUrls.get(b.dataset.img);
      if (u && !img.getAttribute("src")) img.src = u;
    });
  };
  list.addEventListener("load", e => { if (e.target.tagName === "IMG" && nearBottomBeforeImg) toBottom(false); }, true);
  let nearBottomBeforeImg = true;
  const add = (items, where) => {
    nearBottomBeforeImg = nearBottom();
    const fresh = items.filter(m => !known.has(m.id));
    fresh.forEach(m => { known.set(m.id, m); newest = Math.max(newest, m.id); if (oldest === null || m.id < oldest) oldest = m.id; });
    const html = fresh.slice().sort((a, b) => a.id - b.id).map(bubbleHtml).join("");
    if (where === "top") list.insertAdjacentHTML("afterbegin", html);
    else {
      // New messages go before any still-sending ones of mine.
      const firstPending = list.querySelector(".msg.pending, .msg.failed");
      if (firstPending) firstPending.insertAdjacentHTML("beforebegin", html); else list.insertAdjacentHTML("beforeend", html);
    }
    fixDays();
    loadImages();
    return fresh;
  };
  const updateRead = items => items.forEach(m => {
    if (!m.mine || !m.read_at) return;
    const el = list.querySelector(`.msg[data-id="${m.id}"] [data-state]`);
    if (el && el.textContent !== "Прочитано") el.textContent = "Прочитано";
  });

  // Fade a bubble out, then remove it and tidy the day separators.
  const dropBubble = li => {
    if (!li) return;
    const done = () => { li.remove(); fixDays(); };
    if (reduced()) { done(); return; }
    li.classList.add("leaving"); setTimeout(done, 220);
  };

  // Erasing my message: trash → inline confirmation under the bubble → gone for both.
  // The same question for the trash, a long press and a swipe.
  const askDelete = li => {
    if (li.querySelector(".msg-confirm")) { closeConfirms(); return; }
    closeConfirms();
    li.classList.add("confirming");
    li.insertAdjacentHTML("beforeend", `<div class="msg-confirm" role="group" aria-label="Стереть сообщение">
      <p>Стереть сообщение? Оно пропадёт и у собеседника.</p>
      <div class="acct-actions"><button type="button" class="btn warn" data-del-yes>Стереть</button><button type="button" class="btn quiet" data-del-no>Отмена</button></div>
    </div>`);
    li.querySelector("[data-del-no]").focus({ preventScroll: true });
    li.querySelector(".msg-confirm").scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
  };
  const closeConfirms = except => list.querySelectorAll(".msg-confirm").forEach(c => { if (c !== except) { c.closest(".msg")?.classList.remove("confirming"); c.remove(); } });
  list.addEventListener("click", e => {
    const pic = e.target.closest(".msg-img");
    if (pic) { const src = pic.querySelector("img")?.src; if (src) openViewer(src); return; }
    const del = e.target.closest("[data-del]");
    if (del) { askDelete(del.closest(".msg")); return; }
    if (e.target.closest("[data-del-no]")) { const li = e.target.closest(".msg"); closeConfirms(); li.querySelector("[data-del]")?.focus(); return; }
    const yes = e.target.closest("[data-del-yes]");
    if (yes) {
      const li = yes.closest(".msg"), id = Number(li.dataset.id);
      yes.disabled = true; yes.classList.add("loading");
      messages.remove(id).then(() => {
        known.delete(id);
        dropBubble(li);
        toast("Сообщение стёрто");
      }).catch(err => {
        if (err instanceof AuthRequired) { handleError(err); return; }
        yes.disabled = false; yes.classList.remove("loading");
        toast("Не удалось стереть. Попробуйте ещё раз.");
      });
    }
  });
  // Swipe left on my own bubble to erase it; a long press still works as before.
  let pressTimer = 0, sw = null;
  const MAX_DRAG = 96;
  const swipeEnd = (li, drag) => {
    const row = li.querySelector(".bubble-row");
    li.classList.remove("swiping");
    row.style.transform = "";
    li.style.removeProperty("--drag");
    if (drag) askDelete(li);
  };
  list.addEventListener("touchstart", e => {
    const li = e.target.closest(".msg.mine");
    if (!li || e.target.closest("button") || li.classList.contains("pending") || li.classList.contains("failed")) return;
    const t = e.touches[0];
    sw = { li, x: t.clientX, y: t.clientY, dx: 0, active: false };
    pressTimer = setTimeout(() => {
      list.querySelectorAll(".msg.show-actions").forEach(x => { if (x !== li) x.classList.remove("show-actions"); });
      li.classList.toggle("show-actions");
      navigator.vibrate?.(10);
    }, 450);
  }, { passive: true });
  list.addEventListener("touchmove", e => {
    clearTimeout(pressTimer);
    if (!sw) return;
    const t = e.touches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    // Decide once: a clearly sideways move is a swipe, anything else stays a scroll.
    if (!sw.active) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { sw = null; return; }
      if (dx > -12 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      sw.active = true;
      sw.li.classList.add("swiping");
      closeConfirms();
    }
    e.preventDefault(); // hold the page still while the bubble follows the finger
    sw.dx = Math.max(-MAX_DRAG, Math.min(0, dx));
    sw.li.querySelector(".bubble-row").style.transform = `translateX(${sw.dx}px)`;
    sw.li.style.setProperty("--drag", Math.min(1, -sw.dx / (MAX_DRAG * 0.6)).toFixed(2));
  }, { passive: false });
  ["touchend", "touchcancel"].forEach(type => list.addEventListener(type, e => {
    clearTimeout(pressTimer);
    if (!sw) return;
    const { li, dx, active } = sw;
    sw = null;
    if (!active) return;
    const far = -dx >= Math.min(MAX_DRAG, li.getBoundingClientRect().width * 0.33);
    if (far && type === "touchend") navigator.vibrate?.(8);
    swipeEnd(li, far && type === "touchend");
  }, { passive: true }));
  list.addEventListener("contextmenu", e => { if (e.target.closest(".msg.mine .bubble") && matchMedia("(hover: none)").matches) e.preventDefault(); });

  // «⋯» in the header: delete the chat for me.
  const moreBtn = main.querySelector("[data-chat-more]"), pop = main.querySelector("[data-chat-pop]");
  const closePop = focus => { if (pop.hidden) return; pop.hidden = true; moreBtn.setAttribute("aria-expanded", "false"); if (focus) moreBtn.focus(); };
  const openPop = mode => {
    pop.innerHTML = mode === "confirm"
      ? `<p class="acct-title">Удалить чат?</p><p class="acct-label">Переписка пропадёт только у вас, у собеседника останется. Если он напишет снова, чат вернётся с новыми сообщениями.</p>
         <div class="acct-actions"><button type="button" class="btn warn" data-clear-yes>Удалить</button><button type="button" class="btn quiet" data-clear-no>Отмена</button></div>`
      : `<div class="acct-menu"><button type="button" class="acct-item danger" data-clear><span class="acct-ico">${TRASH_ICON}</span>Удалить чат</button></div>`;
    pop.hidden = false;
    moreBtn.setAttribute("aria-expanded", "true");
    pop.querySelector("[data-clear], [data-clear-no]")?.focus({ preventScroll: true });
  };
  moreBtn.addEventListener("click", e => { e.stopPropagation(); pop.hidden ? openPop("menu") : closePop(); });
  pop.addEventListener("click", async e => {
    e.stopPropagation();
    if (e.target.closest("[data-clear]")) { openPop("confirm"); return; }
    if (e.target.closest("[data-clear-no]")) { closePop(true); return; }
    const yes = e.target.closest("[data-clear-yes]");
    if (!yes) return;
    yes.disabled = true; yes.classList.add("loading");
    try {
      await messages.clear(withId);
      refreshUnread();
      toast("Чат удалён");
      location.hash = "#/messages";
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      yes.disabled = false; yes.classList.remove("loading");
      toast(/not allowed/i.test(err?.message || "") ? "Здесь пока нечего удалять." : "Не удалось удалить чат. Попробуйте ещё раз.");
    }
  });
  const onDocClick = e => {
    if (!main.isConnected) return;
    closePop();
    if (!e.target.closest(".msg")) { closeConfirms(); list.querySelectorAll(".msg.show-actions").forEach(x => x.classList.remove("show-actions")); }
  };
  const onDocKey = e => { if (e.key === "Escape") { if (!pop.hidden) closePop(true); else closeConfirms(); } };
  onDoc("click", onDocClick);
  onDoc("keydown", onDocKey);

  add(data.items || [], "bottom");
  older.hidden = !data.has_more;
  toBottom(false);
  if ((data.items || []).some(m => !m.mine && !m.read_at)) messages.markRead(withId).then(refreshUnread).catch(() => {});

  older.addEventListener("click", async () => {
    older.disabled = true; older.classList.add("loading");
    const h = document.documentElement.scrollHeight, y = scrollY;
    try {
      const d = await messages.get(withId, { before: oldest });
      add(d.items || [], "top");
      older.hidden = !d.has_more;
      scrollTo(0, y + document.documentElement.scrollHeight - h); // keep the view where it was
    } catch { toast("Не удалось загрузить сообщения."); }
    finally { older.disabled = false; older.classList.remove("loading"); }
  });

  // Poll for new messages and read receipts while the chat is open and the tab is visible.
  let polling = false;
  const poll = async () => {
    if (polling || document.hidden || !main.isConnected) return;
    polling = true;
    try {
      const stick = nearBottom();
      const d = await messages.get(withId, { after: newest, aliveFrom: oldest });
      if (!main.isConnected) return;
      const fresh = add(d.items || [], "bottom");
      if (fresh.some(m => !m.mine)) { messages.markRead(withId).then(refreshUnread).catch(() => {}); if (stick) toBottom(true); }
      // Messages erased by the other side disappear; «Прочитано» appears on mine.
      if (d.alive) {
        const alive = new Map(d.alive.map(a => [a.id, a]));
        for (const [id, m] of known) {
          if (id >= oldest && !alive.has(id)) { known.delete(id); dropBubble(list.querySelector(`.msg[data-id="${id}"]`)); }
          else if (alive.get(id)?.read_at && !m.read_at) m.read_at = alive.get(id).read_at;
        }
        updateRead([...known.values()]);
      }
    } catch (err) { if (err instanceof AuthRequired) handleError(err); }
    finally { polling = false; }
  };
  const timer = setInterval(poll, CHAT_POLL);
  const onVisible = () => { if (!document.hidden) poll(); };
  onDoc("visibilitychange", onVisible);
  stopChat = () => clearInterval(timer);

  if (!form) return;
  const input = form.querySelector("textarea"), send = form.querySelector(".send-btn"), note = form.querySelector("[data-note]");
  // The composer is pinned to the bottom, so when it gets taller (a photo, a longer message)
  // the chat keeps its last messages in view instead of sliding them under it.
  const keepBottom = change => { const stick = nearBottom(); change(); if (stick) toBottom(false); };
  const grow = () => keepBottom(() => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 160) + "px"; });
  // Attached photo: compressed right away, previewed above the field, uploaded on send.
  const attach = form.querySelector("[data-attach]"), preview = form.querySelector("[data-preview]"), previewImg = form.querySelector("[data-preview-img]");
  let photo = null; // { blob, url }
  const clearPhoto = () => { photo = null; preview.hidden = true; previewImg.removeAttribute("src"); refresh(); };
  attach.addEventListener("change", async () => {
    const file = attach.files?.[0];
    attach.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast("Это не картинка. Выберите фото."); return; }
    try {
      const blob = await chatJpeg(file);
      photo = { blob, url: URL.createObjectURL(blob) };
      const stick = nearBottom();
      previewImg.src = photo.url;
      preview.hidden = false;
      await previewImg.decode().catch(() => {}); // the preview has its real height only once the image is decoded
      if (stick) toBottom(false);
      refresh();
      input.focus({ preventScroll: true });
    } catch { toast("Не получилось открыть это фото. Попробуйте другое."); }
  });
  form.querySelector("[data-preview-remove]").addEventListener("click", () => { clearPhoto(); input.focus({ preventScroll: true }); });

  const refresh = () => {
    const len = input.value.trim().length;
    send.disabled = !len && !photo;
    note.textContent = input.value.length > CHAT_MAX - 200 ? `${input.value.length} / ${CHAT_MAX}` : "";
  };
  input.addEventListener("input", () => { grow(); refresh(); });
  // Enter sends on a computer; on phones Enter makes a new line and the button sends.
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      e.preventDefault(); form.requestSubmit();
    }
  });

  const deliver = async (li, body, pic = null) => {
    li.classList.add("pending"); li.classList.remove("failed");
    li.querySelector("[data-retry]")?.remove();
    let st = li.querySelector("[data-state]");
    if (!st) { st = document.createElement("span"); st.setAttribute("data-state", ""); li.querySelector(".msg-meta").appendChild(st); }
    st.textContent = "Отправляется…";
    try {
      // Upload the photo once; a retry reuses the uploaded file.
      if (pic && !pic.path) pic.path = await messages.uploadImage(pic.blob);
      const m = await messages.send(withId, body, pic?.path || null);
      if (pic) chatImageUrls.set(m.image_path, pic.url); // show the local copy, no need to download it back
      // A poll may have brought this message already; then just drop the placeholder.
      if (list.querySelector(`.msg[data-id="${m.id}"]`)) li.remove();
      else { known.set(m.id, m); newest = Math.max(newest, m.id); if (oldest === null) oldest = m.id; li.outerHTML = bubbleHtml(m); }
      fixDays();
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      li.classList.remove("pending"); li.classList.add("failed");
      st.remove();
      li.insertAdjacentHTML("beforeend", `<button type="button" class="inline-link msg-retry" data-retry>Не отправилось. Повторить</button>`);
      li.querySelector("[data-retry]").addEventListener("click", () => deliver(li, body, pic));
      // Keep «Повторить» above the sticky composer.
      if (li === list.lastElementChild) toBottom(true);
      toast(chatError(err));
    }
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const body = input.value.trim();
    if (!body && !photo) return;
    const pic = photo;
    input.value = ""; grow();
    if (pic) { photo = null; preview.hidden = true; previewImg.removeAttribute("src"); }
    refresh();
    const tmp = { id: `tmp-${++pendingSeq}`, mine: true, body, local_image: pic?.url, created_at: new Date().toISOString(), pending: true };
    list.insertAdjacentHTML("beforeend", bubbleHtml(tmp));
    fixDays();
    toBottom(true);
    deliver(list.lastElementChild, body, pic);
    input.focus();
  });
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) input.focus({ preventScroll: true });
}

/* ---------- dialogs list ---------- */
function dialogRow(d) {
  const w = d.with || {};
  const ava = w.avatar_url ? `<img src="${esc(w.avatar_url)}" alt="" loading="lazy" decoding="async">` : esc((w.email?.[0] || "?").toUpperCase());
  const when = d.last_at ? (dayKey(d.last_at) === new Date().toDateString() ? fmtTime(d.last_at) : new Date(d.last_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })) : "";
  return `<li><a class="dialog-row${d.unread ? " has-unread" : ""}" href="#/chat/${encodeURIComponent(w.id)}">
    <span class="me-ava user-ava${w.avatar_url ? " has-photo" : ""}" aria-hidden="true">${ava}</span>
    <div class="dialog-main">
      <p class="dialog-top"><span class="user-mail">${esc(displayName(w))}</span><time class="dialog-when" datetime="${esc(d.last_at || "")}">${when}</time></p>
      <p class="dialog-last"><span>${d.last_mine ? "Вы: " : ""}${d.last_image ? `📷 ${esc(d.last_body || "Фото")}` : esc(d.last_body || "")}</span>${d.unread ? `<span class="unread-badge inline" aria-label="непрочитанных: ${d.unread}">${unreadText(d.unread)}</span>` : ""}</p>
      <p class="user-meta">${d.i_am_teacher ? "Ученик" : "Учитель"}</p>
    </div>
  </a></li>`;
}

async function renderMessages() {
  removeFloating();
  document.title = "Сообщения · English";
  app.innerHTML = topbar(true) + `
    <main class="wrap screen">
      <header class="hero">
        <p class="kicker">Переписка</p>
        <h1>Сообщения</h1>
        <p class="lead">${isTeacher() ? "Переписка с учениками. Написать новому ученику можно со страницы ученика в разделе «Ученики»." : "Сообщения от учителей. Ответить можно в любом диалоге."}</p>
      </header>
      <p class="hint-line" data-count></p>
      <ul class="users dialogs" data-list></ul>
      <p class="empty" data-empty hidden>${isTeacher() ? "Переписок пока нет." : "Учитель ещё не писал вам. Когда напишет, сообщение появится здесь, а на аватаре загорится счётчик."}</p>
      <div class="more-line"><button type="button" class="btn quiet" data-more hidden>Показать ещё</button></div>
      <p class="back-line"><a class="back" href="#/">← Все уроки</a></p>
    </main>`;
  bindTopbar();
  window.scrollTo(0, 0);
  const main = app.querySelector("main");
  const list = main.querySelector("[data-list]"), more = main.querySelector("[data-more]");
  let loaded = 0;
  const load = async () => {
    more.disabled = true; more.classList.add("loading");
    try {
      const d = await messages.dialogs(PAGE, loaded);
      const start = list.children.length;
      list.insertAdjacentHTML("beforeend", (d.items || []).map(dialogRow).join(""));
      [...list.children].slice(start).forEach((li, i) => { li.classList.add("rise-in"); li.style.setProperty("--i", Math.min(i, 8)); });
      loaded += (d.items || []).length;
      main.querySelector("[data-count]").textContent = d.total ? `${d.total} ${plural(d.total, "диалог", "диалога", "диалогов")}` : "";
      main.querySelector("[data-empty]").hidden = d.total > 0;
      more.hidden = loaded >= d.total;
    } catch (err) {
      if (err instanceof AuthRequired) { handleError(err); return; }
      toast("Не удалось загрузить сообщения. Проверьте интернет.");
    } finally { more.disabled = false; more.classList.remove("loading"); }
  };
  more.addEventListener("click", load);
  await load();
}

/* ---------- router ---------- */
// The recovery link lands as #access_token=…&type=recovery, or #error=…&error_code=otp_expired.
const initialHash = window.__authHash || "";
let recovery = /type=recovery/.test(initialHash);
let recoveryError = /error_code=|error=/.test(initialHash) ? "Ссылка устарела или уже использована. Запросите новую." : "";

let firstRoute = true;
// The screen we came from (for «назад» in the chat).
let prevHash = "", curHash = location.hash;
window.addEventListener("hashchange", () => { prevHash = curHash; curHash = location.hash; });
async function route() {
  const session = await auth.session();
  if (recoveryError) {
    const text = recoveryError; recoveryError = "";
    history.replaceState(null, "", location.pathname + "#/");
    firstRoute = false;
    renderForgot("", text);
    return;
  }
  if (recovery) {
    firstRoute = false;
    if (session) { setUser(session.user); renderNewPassword(); }
    else { recovery = false; renderForgot("", "Ссылка устарела или уже использована. Запросите новую."); }
    return;
  }
  // Back/forward between profile tabs: switch in place, no reload of the stats.
  if (session && location.hash.startsWith("#/profile") && app.querySelector("[data-ptabs]")) {
    showProfileTab(profileTab());
    return;
  }
  // Soft cross-fade between screens (skipped on first paint and with reduced motion).
  if (!firstRoute && !reduced() && app.firstElementChild) {
    app.classList.add("leaving");
    await sleep(140);
    app.classList.remove("leaving");
  }
  firstRoute = false;
  if (!session) { setUser(null); renderAuth("login"); return; }
  setUser(session.user);
  await loadRole(session.user);
  refreshUnread();
  const m = location.hash.match(/^#\/lesson\/([^/?#]+)(?:\?t=([^&#]+))?/);
  if (m) renderLesson(decodeURIComponent(m[1]), m[2] ? decodeURIComponent(m[2]) : "");
  else if (location.hash.startsWith("#/profile")) renderProfile();
  else if (location.hash.startsWith("#/users")) renderUsers();
  else if (location.hash.startsWith("#/words")) renderWords();
  else if (location.hash.startsWith("#/messages")) renderMessages();
  else if (location.hash.startsWith("#/chat/")) renderChat(decodeURIComponent(location.hash.slice("#/chat/".length)));
  else if (location.hash.startsWith("#/students/")) renderStudent(decodeURIComponent(location.hash.slice("#/students/".length)));
  else if (location.hash.startsWith("#/students")) renderStudents();
  else renderList();
}

// Defer: calling supabase auth inside onAuthStateChange deadlocks supabase-js.
auth.onChange(event => {
  if (event === "SIGNED_OUT" && !loggingOut && app.querySelector("[data-logout]")) setTimeout(route, 0);
  if (event === "PASSWORD_RECOVERY" && !recovery) { recovery = true; setTimeout(route, 0); }
});
setupWords({
  app, topbar, bindTopbar, removeFloating, handleError, toast, plural, reduced,
  newScreen: () => ++screenToken, isScreen: t => t === screenToken,
  icons: { search: SEARCH_ICON, trash: TRASH_ICON, close: CLOSE_ICON },
});
window.addEventListener("hashchange", route);
route();

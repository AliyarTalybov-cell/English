// Supabase: email + password accounts (no confirmation email), shared lessons, per-user progress via RLS.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://njxhuyalekejwgvimenx.supabase.co";
const SUPABASE_KEY = "sb_publishable_YwSQ988gis_UrwTG0VXPAg_4LDh9-JT";

// Network activity for the thin progress line at the top of the page. Background polling
// (new messages, the unread counter, training results) does not count, so the line never blinks on its own.
let inflight = 0;
const busyListeners = new Set();
export const onBusy = fn => { busyListeners.add(fn); return () => busyListeners.delete(fn); };
const setBusy = d => { inflight = Math.max(0, inflight + d); busyListeners.forEach(fn => fn(inflight > 0)); };
const QUIET = /\/rpc\/(unread_count|word_result)\b|\/auth\/v1\/token/;
const isQuiet = (url, opts) => QUIET.test(url) || (/\/rpc\/get_messages\b/.test(url) && /"p_after":\d/.test(String(opts?.body || "")));
// A request on a bad mobile connection must not hang forever: cut it off so the page can say so and offer a retry.
// Uploads get more time than ordinary queries.
const timedFetch = (url, opts = {}) => {
  if (!AbortSignal.timeout) return fetch(url, opts);
  // Uploads and the AI helper (it reads data and thinks) get more time than ordinary queries.
  const timeout = AbortSignal.timeout(/\/functions\/v1\//.test(String(url)) ? 120000 : /\/storage\/v1\//.test(String(url)) ? 60000 : 20000);
  const signal = !opts.signal ? timeout : AbortSignal.any ? AbortSignal.any([opts.signal, timeout]) : opts.signal;
  return fetch(url, { ...opts, signal });
};
const trackedFetch = (url, opts) => {
  if (isQuiet(String(url), opts)) return timedFetch(url, opts);
  setBusy(1);
  return timedFetch(url, opts).finally(() => setBusy(-1));
};

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // implicit flow: the recovery link carries tokens in the URL, so it works on any device
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit", storageKey: "english-auth" },
  global: { fetch: trackedFetch },
});

export class AuthRequired extends Error {}

const AUTH_MESSAGES = [
  [/wrong current password/i, "Текущий пароль неверный."],
  [/invalid login credentials/i, "Неверный email или пароль."],
  [/email rate limit/i, "Лимит писем на этот час исчерпан. Попробуйте позже."],
  [/only request this after/i, "Письмо уже отправлено. Новое можно запросить через минуту."],
  [/already registered|already exists/i, "Этот email уже зарегистрирован. Войдите во вкладке «Вход»."],
  [/password should be at least|weak password/i, "Пароль слишком короткий: нужно минимум 6 символов."],
  [/invalid format|validate email|email address .* is invalid/i, "Проверьте email: похоже, в адресе опечатка."],
  [/rate limit|too many/i, "Слишком много попыток. Подождите пару минут и попробуйте снова."],
  [/signups not allowed|signup is disabled/i, "Регистрация сейчас закрыта."],
  [/should be different|same password/i, "Новый пароль совпадает со старым. Придумайте другой."],
  [/expired|invalid.*(token|link)|otp/i, "Ссылка устарела или уже использована. Запросите новую."],
];
export function authMessage(err) {
  const text = err?.message || "";
  for (const [re, msg] of AUTH_MESSAGES) if (re.test(text)) return msg;
  if (/fetch|network|timed? ?out|abort/i.test(text)) return "Нет связи с сервером. Проверьте интернет.";
  return "Не получилось. Попробуйте ещё раз.";
}

function check(error) {
  if (!error) return;
  if (error.code === "PGRST301" || /jwt|not authenticated|permission denied/i.test(error.message || "")) throw new AuthRequired(error.message);
  throw new Error(error.message);
}

async function userId() {
  const { data } = await sb.auth.getSession();
  const id = data.session?.user?.id;
  if (!id) throw new AuthRequired("no session");
  return id;
}

export const auth = {
  session: async () => (await sb.auth.getSession()).data.session,
  signUp: async (email, password) => {
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.session) {
      const r = await sb.auth.signInWithPassword({ email, password });
      if (r.error) throw r.error;
    }
  },
  signIn: async (email, password) => {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  signOut: () => { cache.clear(); return sb.auth.signOut(); },
  resetPassword: async email => {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/` });
    if (error) throw error;
  },
  updatePassword: async password => {
    const { error } = await sb.auth.updateUser({ password });
    if (error) throw error;
  },
  // Re-check the current password by signing in again before changing it.
  changePassword: async (email, current, next) => {
    const r = await sb.auth.signInWithPassword({ email, password: current });
    if (r.error) throw /invalid login credentials/i.test(r.error.message) ? new Error("wrong current password") : r.error;
    const { error } = await sb.auth.updateUser({ password: next });
    if (error) throw error;
  },
  onChange: fn => sb.auth.onAuthStateChange((event) => fn(event)),
};

// Profile photo: one file per user, <user id>/avatar.jpg in the public bucket; its URL sits in user metadata.
const AVATAR_BUCKET = "Photo";
export const avatar = {
  upload: async blob => {
    const id = await userId();
    const path = `${id}/avatar.jpg`;
    const up = await sb.storage.from(AVATAR_BUCKET).upload(path, blob, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
    if (up.error) throw up.error;
    // ?v= busts the browser/CDN cache after replacing the photo.
    const url = `${sb.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
    const { error } = await sb.auth.updateUser({ data: { avatar_url: url } });
    if (error) throw error;
    return url;
  },
  remove: async () => {
    const id = await userId();
    const { error } = await sb.auth.updateUser({ data: { avatar_url: null } });
    if (error) throw error;
    await sb.storage.from(AVATAR_BUCKET).remove([`${id}/avatar.jpg`]);
  },
};

export const roles = {
  // 'admin', 'teacher' or null
  mine: async () => {
    const { data, error } = await sb.rpc("my_role");
    check(error);
    return data || null;
  },
  // Server-side search by email and paging: returns { total, items, ... }.
  listUsers: async (query, limit, offset) => {
    const { data, error } = await sb.rpc("admin_list_users", { p_query: query, p_limit: limit, p_offset: offset });
    check(error);
    return data || { total: 0, items: [] };
  },
  listStudents: async (query, limit, offset) => {
    const { data, error } = await sb.rpc("teacher_list_students", { p_query: query, p_limit: limit, p_offset: offset });
    check(error);
    return data || { total: 0, items: [] };
  },
  studentWords: async userId => {
    const { data, error } = await sb.rpc("teacher_student_words", { p_user: userId });
    check(error);
    return data || { total: 0, learned: 0, items: [] };
  },
  addStudentWords: async (userId, items) => {
    const { data, error } = await sb.rpc("teacher_add_words", { p_user: userId, p_items: items });
    check(error);
    return data || { added: 0, updated: 0, skipped: 0 };
  },
  removeStudentWord: async (userId, word) => {
    const { error } = await sb.rpc("teacher_remove_word", { p_user: userId, p_word: word });
    check(error);
  },
  studentStats: async userId => {
    const { data, error } = await sb.rpc("teacher_student_stats", { p_user: userId });
    check(error);
    if (!data) throw new Error("not_found");
    return data;
  },
  setTeacher: async (userId, on) => {
    const { error } = await sb.rpc("admin_set_teacher", { p_user: userId, p_on: on });
    check(error);
  },
};

const CHAT_BUCKET = "chat";
// Messages between a teacher and a student (one dialog per pair; a teacher starts it).
export const messages = {
  send: async (to, body, image = null) => {
    const { data, error } = await sb.rpc("send_message", { p_to: to, p_body: body, p_image: image });
    check(error);
    return data;
  },
  // newest first; before/after are message ids for older pages and for polling
  // aliveFrom: also return which messages from that id on still exist, with read_at (for erased ones and «Прочитано»)
  get: async (withId, { before = null, after = null, limit = 30, aliveFrom = null } = {}) => {
    const { data, error } = await sb.rpc("get_messages", { p_with: withId, p_before: before, p_after: after, p_limit: limit, p_alive_from: aliveFrom });
    check(error);
    return data;
  },
  unread: async () => {
    const { data, error } = await sb.rpc("unread_count");
    check(error);
    return data || 0;
  },
  dialogs: async (limit, offset) => {
    const { data, error } = await sb.rpc("list_dialogs", { p_limit: limit, p_offset: offset });
    check(error);
    return data || { total: 0, items: [] };
  },
  // Erase my own message for both sides; its photo file goes too.
  remove: async id => {
    const { data: path, error } = await sb.rpc("delete_message", { p_id: id });
    check(error);
    if (path) await sb.storage.from(CHAT_BUCKET).remove([path]).catch(() => {});
  },
  // Photo for a message: private bucket «chat», <my id>/<random>.jpg. Returns the path to pass to send().
  uploadImage: async blob => {
    const path = `${await userId()}/${crypto.randomUUID().replace(/-/g, "")}.jpg`;
    const { error } = await sb.storage.from(CHAT_BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "3600" });
    if (error) throw error;
    return path;
  },
  // Temporary links (1 hour) to photos the user may see: { path: url }.
  imageUrls: async paths => {
    const { data, error } = await sb.storage.from(CHAT_BUCKET).createSignedUrls(paths, 3600);
    if (error) throw error;
    return Object.fromEntries((data || []).filter(x => x.signedUrl).map(x => [x.path, x.signedUrl]));
  },
  // Hide the whole dialog for me only.
  clear: async withId => {
    const { error } = await sb.rpc("clear_dialog", { p_with: withId });
    check(error);
  },
  markRead: async withId => {
    const { data, error } = await sb.rpc("mark_read", { p_with: withId });
    check(error);
    return data || 0;
  },
};

// Personal details: surname, name, patronymic, phone (all optional).
export const profile = {
  get: async () => {
    const { data, error } = await sb.rpc("get_my_profile");
    check(error);
    return data || {};
  },
  save: async ({ last_name, first_name, middle_name, phone }) => {
    const { data, error } = await sb.rpc("update_my_profile", { p_last_name: last_name, p_first_name: first_name, p_middle_name: middle_name, p_phone: phone });
    check(error);
    return data || {};
  },
};

// Screens that are opened again and again keep their last answer here: the screen is drawn from it at once
// and refreshed in the background. Progress changes and signing out empty it.
export const cache = new Map();
const dropProgressCache = () => { cache.delete("lessons"); cache.delete("profile"); cache.delete("due"); cache.delete("day"); };

export const api = {
  listLessons: async () => {
    const { data, error } = await sb.rpc("list_lessons");
    check(error);
    return data || [];
  },
  profileStats: async () => {
    const { data, error } = await sb.rpc("profile_stats");
    check(error);
    return data || [];
  },
  // Spaced repetition: a finished portion schedules the topic, the home screen asks what is due.
  scheduleReview: async (slug, sectionId, allRight) => {
    const { error } = await sb.rpc("schedule_review", { p_slug: slug, p_section: sectionId, p_ok: allRight });
    check(error);
    cache.delete("due");
  },
  dueReviews: async () => {
    const { data, error } = await sb.rpc("due_reviews", { p_limit: 5 });
    check(error);
    return data || { total: 0, items: [] };
  },
  // Daily goal and streak; the browser's own day boundary is used.
  dayStats: async () => {
    const { data, error } = await sb.rpc("day_stats", { p_offset: -new Date().getTimezoneOffset() });
    check(error);
    return data || { today: 0, goal: 15, streak: 0 };
  },
  // «Мои слова»: saved from the tap-a-word translation, trained with cards.
  addWord: async (word, ru) => {
    const { error } = await sb.rpc("add_word", { p_word: word, p_ru: ru });
    check(error);
    cache.delete("words");
  },
  removeWord: async word => {
    const { error } = await sb.rpc("remove_word", { p_word: word });
    check(error);
    cache.delete("words");
  },
  removeAllWords: async () => {
    const { error } = await sb.rpc("remove_all_words");
    check(error);
    cache.delete("words");
  },
  myWords: async (dueOnly = false, limit = 50, offset = 0) => {
    const { data, error } = await sb.rpc("list_my_words", { p_due_only: dueOnly, p_limit: limit, p_offset: offset });
    check(error);
    return data || { total: 0, due: 0, items: [] };
  },
  wordResult: async (word, known) => {
    const { error } = await sb.rpc("word_result", { p_word: word, p_ok: known });
    check(error);
    cache.delete("words");
  },
  // «Спросить»: the students' AI helper (Edge Function `ask`). messages: [{ role: "user" | "assistant", text }].
  ask: async (messages, context) => {
    const { data, error } = await sb.functions.invoke("ask", { body: { messages, context } });
    if (!error) return data;
    const status = error.context?.status;
    let body = {};
    try { body = await error.context.json(); } catch {}
    if (status === 401) throw new AuthRequired("ask");
    const err = new Error(body.error || "unavailable");
    err.code = body.error || (status === 429 ? "limit" : "unavailable");
    throw err;
  },
  aiLeft: async () => {
    const { data, error } = await sb.rpc("ai_questions_left");
    check(error);
    return data;
  },
  getLesson: async slug => {
    const { data, error } = await sb.rpc("get_lesson", { p_slug: slug });
    check(error);
    if (!data) throw new Error("not_found");
    return data;
  },
  saveStatus: async (slug, item, status) => {
    const { error } = await sb.from("progress").upsert(
      { user_id: await userId(), lesson_slug: slug, item_id: item, status, fixed: false, updated_at: new Date().toISOString() },
      { onConflict: "user_id,lesson_slug,item_id" });
    check(error);
    dropProgressCache();
  },
  markFixed: async (slug, item) => {
    const { error } = await sb.from("progress").update({ fixed: true, updated_at: new Date().toISOString() })
      .eq("lesson_slug", slug).eq("item_id", item);
    check(error);
    dropProgressCache();
  },
  resetSection: async (slug, section) => {
    const { error } = await sb.from("progress").delete().eq("lesson_slug", slug).like("item_id", `${section}-%`);
    check(error);
    dropProgressCache();
  },
};

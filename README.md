# English

Сайт с уроками английского: https://english-platform-orcin.vercel.app

- **Фронтенд:** Vite + обычный JavaScript (`src/`), деплой в Vercel (проект `english-platform`).
- **База и авторизация:** Supabase, проект «English» (`njxhuyalekejwgvimenx`).
- **Вход:** email + пароль. Подтверждение почты при регистрации отключено; письма уходят только для восстановления пароля.
- **Уроки** общие (таблица `lessons`), **прогресс** у каждого пользователя свой (таблица `progress`, защищена RLS).

## Восстановление пароля

На экране входа есть «Забыли пароль?»: пользователь вводит email, получает письмо со ссылкой и на сайте задаёт новый пароль. Ссылка живёт 1 час и открывается на любом устройстве.

Пока письма отправляет встроенная почта Supabase (noreply@mail.app.supabase.io). У неё три ограничения:
- письма доходят только до адресов участников команды проекта в Supabase;
- не больше 2 писем в час на весь проект;
- текст письма нельзя поменять, он английский («Reset your password»).

Все три снимаются подключением своего SMTP: Supabase → Authentication → Emails → SMTP Settings. После этого можно включить русский шаблон письма.

## Сбросить пароль вручную

Запасной вариант, если письмо не доходит. Откройте Supabase → проект «English» → **SQL Editor** и выполните, подставив email и новый пароль (минимум 6 символов):

```sql
update auth.users
set encrypted_password = extensions.crypt('НОВЫЙ_ПАРОЛЬ', extensions.gen_salt('bf')),
    updated_at = now()
where email = 'user@example.com';
```

Затем сообщите пользователю новый пароль. Сменить его сам он может через «Забыли пароль?».

## Удалить пользователя

Supabase → **Authentication → Users** → пользователь → **Delete user**. Его прогресс удалится автоматически.

## Деплой

```sh
npm run build
npx vercel@latest deploy --prod --scope aliyartalybov-cells-projects
```

## Уроки

Исходники лежат в `supabase/lessons/*.mjs`, по одному файлу на урок (7 — контрольные). Урок 1 собирается из `1-to-be.base.json` и новых тем в `1-to-be.mjs`. Новые темы и группы заданий добавляйте в конец (функция `extend`), чтобы не сбить прогресс учеников. Короткие тексты «Текст на слух» в конце практики каждой темы лежат в `supabase/lessons/listen.mjs` (урок → тема → английский текст и перевод). После правки соберите миграцию, она проверит задания и запишет JSON и SQL:

```sh
node supabase/lessons/build.mjs lessons_update
supabase db push
```

## Изменения в базе

Миграции лежат в `supabase/migrations/`. Применить новые:

```sh
supabase db push
```

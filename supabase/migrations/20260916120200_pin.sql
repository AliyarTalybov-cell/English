-- PIN hash was set once on 2026-09-16. The plain PIN is intentionally not stored in the repo.
-- To change it, run in Supabase SQL Editor:
-- update public.app_secret set pin_hash = extensions.crypt('NEW_PIN', extensions.gen_salt('bf')) where id = 1;
select 1;

-- AI helper: 100 questions a day per student. The limit now only protects the shared free Gemini quota
-- from a single student; an ordinary student never reaches it.
create or replace function public.ai_daily_limit()
returns int
language sql
immutable
as $$ select 100 $$;

-- AI helper: 200 questions a day per student.
create or replace function public.ai_daily_limit()
returns int
language sql
immutable
as $$ select 200 $$;

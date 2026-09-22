-- AI helper for students: a daily question counter. The helper itself runs in the `ask` Edge Function;
-- the counter lives here so the limit holds no matter which device asks. Nothing else is stored:
-- questions and answers are not saved.

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  count int not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;
-- No policies: the table is reached only through the functions below.

-- Questions a student may ask per day.
create or replace function public.ai_daily_limit()
returns int
language sql
immutable
as $$ select 20 $$;

-- How many questions are left today.
create or replace function public.ai_questions_left()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select public.ai_daily_limit() - coalesce(
    (select count from ai_usage where user_id = auth.uid() and day = (now() at time zone 'utc')::date), 0);
$$;

-- Take one question from today's allowance. Returns how many are left after it, or -1 when the limit is reached.
create or replace function public.ai_take_question()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_count int;
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  insert into ai_usage as u (user_id, day, count)
  values (v_me, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update set count = u.count + 1
    where u.count < public.ai_daily_limit()
  returning count into v_count;
  if v_count is null then
    return -1;
  end if;
  return public.ai_daily_limit() - v_count;
end;
$$;

-- Give the question back when the helper could not answer (network error, service unavailable).
-- Only the Edge Function may call it (service role): a student calling it would reset their own limit.
create or replace function public.ai_refund_question(p_user uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update ai_usage set count = greatest(count - 1, 0)
  where user_id = p_user and day = (now() at time zone 'utc')::date;
$$;

revoke all on function public.ai_questions_left(), public.ai_take_question(), public.ai_refund_question(uuid) from public, anon, authenticated;
grant execute on function public.ai_questions_left(), public.ai_take_question() to authenticated;
grant execute on function public.ai_refund_question(uuid) to service_role;

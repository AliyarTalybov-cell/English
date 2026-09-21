-- Daily goal and streak. The day is counted in the student's own time zone: the browser sends its
-- offset in minutes (as Date.getTimezoneOffset() reports it, inverted), so an evening lesson at 23:30
-- does not fall into the next day.
create or replace function public.day_stats(p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_off int := greatest(least(coalesce(p_offset, 0), 840), -840);
  v_today date;
  v_today_n int;
  v_streak int;
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  v_today := (now() + make_interval(mins => v_off))::date;
  select count(*) into v_today_n
  from progress p
  where p.user_id = v_me and (p.updated_at + make_interval(mins => v_off))::date = v_today;

  with days as (
    select distinct (p.updated_at + make_interval(mins => v_off))::date as day
    from progress p where p.user_id = v_me
  ),
  ranked as (select day, row_number() over (order by day desc) as rn from days),
  -- consecutive days share the same anchor date
  grouped as (select day, day + (rn || ' days')::interval as anchor from ranked)
  select count(*) into v_streak
  from grouped
  where anchor = (select anchor from grouped where day in (v_today, v_today - 1) order by day desc limit 1);

  return json_build_object('today', v_today_n, 'goal', 15, 'streak', coalesce(v_streak, 0),
                           'worked_today', v_today_n > 0);
end;
$$;

revoke all on function public.day_stats(int) from public, anon;
grant execute on function public.day_stats(int) to authenticated;

-- The first clean round must come back in a day: the streak counts rounds, so the gaps start at 1.
create or replace function public._review_gap(p_streak int)
returns int
language sql
immutable
as $$
  select case least(greatest(p_streak, 1), 5) when 1 then 1 when 2 then 3 when 3 then 7 when 4 then 14 else 30 end;
$$;

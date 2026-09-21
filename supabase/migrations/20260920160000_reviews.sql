-- Spaced repetition: after a portion of practice a topic goes into the queue and comes back
-- a day later, then in three days, a week, two weeks, a month. Mistakes reset it back to a day.
create table public.review_queue (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text not null references public.lessons(slug) on delete cascade on update cascade,
  section_id text not null,
  streak int not null default 0,
  due_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug, section_id)
);
alter table public.review_queue enable row level security;
create index review_queue_due on public.review_queue (user_id, due_at);

-- Days until the next repetition, by how many clean rounds in a row.
create or replace function public._review_gap(p_streak int)
returns int
language sql
immutable
as $$
  select case least(greatest(p_streak, 0), 4) when 0 then 1 when 1 then 3 when 2 then 7 when 3 then 14 else 30 end;
$$;

-- Called when a portion of practice is finished. p_ok = the whole portion was right first time.
create or replace function public.schedule_review(p_slug text, p_section text, p_ok boolean)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_streak int;
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if not exists (select 1 from lessons where slug = p_slug and published) then
    raise exception 'lesson not found' using errcode = 'P0002';
  end if;
  select streak into v_streak from review_queue where user_id = v_me and lesson_slug = p_slug and section_id = p_section;
  v_streak := case when p_ok then coalesce(v_streak, 0) + 1 else 0 end;
  insert into review_queue (user_id, lesson_slug, section_id, streak, due_at, updated_at)
  values (v_me, p_slug, p_section, v_streak, now() + (public._review_gap(v_streak) || ' days')::interval, now())
  on conflict (user_id, lesson_slug, section_id) do update
    set streak = excluded.streak, due_at = excluded.due_at, updated_at = now();
end;
$$;

-- Topics whose time has come, soonest first, with their names taken from the lesson content.
create or replace function public.due_reviews(p_limit int default 5)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_limit int := least(greatest(coalesce(p_limit, 5), 1), 20);
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return (
    with due as (
      select r.lesson_slug, r.section_id, r.due_at, r.streak
      from review_queue r
      where r.user_id = v_me and r.due_at <= now()
      order by r.due_at
      limit v_limit
    ),
    named as (
      select d.*, l.title as lesson_title, l.position,
        (select s.value ->> 'nav'
         from lessons l2, jsonb_array_elements(l2.content -> 'sections') s
         where l2.slug = d.lesson_slug and s.value ->> 'id' = d.section_id
         limit 1) as nav,
        (select count(*) from progress p
          where p.user_id = v_me and p.lesson_slug = d.lesson_slug
            and p.item_id like d.section_id || '-%'
            and p.status <> 'ok' and not p.fixed) as mistakes
      from due d join lessons l on l.slug = d.lesson_slug and l.published
    )
    select json_build_object(
      'total', (select count(*) from review_queue r where r.user_id = v_me and r.due_at <= now()),
      'items', coalesce((select json_agg(row_to_json(n) order by n.due_at) from named n where n.nav is not null), '[]'::json)
    )
  );
end;
$$;

revoke all on function public._review_gap(int) from public, anon, authenticated;
revoke all on function public.schedule_review(text, text, boolean), public.due_reviews(int) from public, anon;
grant execute on function public.schedule_review(text, text, boolean), public.due_reviews(int) to authenticated;

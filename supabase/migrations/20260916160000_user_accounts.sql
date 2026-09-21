-- Switch from a shared PIN to Supabase Auth accounts (email + password, no confirmation email).
-- Lessons are shared; progress belongs to each user and is protected by RLS.

-- 1. Remove the PIN mechanism.
drop function if exists public.verify_pin(text);
drop function if exists public.list_lessons(text);
drop function if exists public.get_lesson(text, text);
drop function if exists public.save_status(text, text, text, text);
drop function if exists public.mark_fixed(text, text, text);
drop function if exists public.reset_section(text, text, text);
drop function if exists public._check_pin(text);
drop table if exists public.app_secret;
drop table if exists public.pin_attempts;

-- 2. Progress becomes per user (old shared progress is discarded).
delete from public.progress;
alter table public.progress drop constraint progress_pkey;
alter table public.progress add column user_id uuid not null default auth.uid() references auth.users(id) on delete cascade;
alter table public.progress add primary key (user_id, lesson_slug, item_id);

-- 3. Row level security.
grant select on public.lessons to authenticated;
create policy "lessons readable by signed-in users" on public.lessons
  for select to authenticated using (published);

grant select, insert, update, delete on public.progress to authenticated;
create policy "own progress: select" on public.progress for select to authenticated using (user_id = (select auth.uid()));
create policy "own progress: insert" on public.progress for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own progress: update" on public.progress for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own progress: delete" on public.progress for delete to authenticated using (user_id = (select auth.uid()));

-- 4. RPC helpers. security invoker: RLS applies, each user only sees their own rows.
create or replace function public.list_lessons()
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(json_agg(row_to_json(t) order by t.position, t.title), '[]'::json)
  from (
    select l.slug, l.title, l.subtitle, l.position,
      (select count(*) from jsonb_path_query(l.content, '$.sections[*].groups[*].items[*]')) as total,
      (select count(*) from progress p where p.lesson_slug = l.slug) as done,
      (select count(*) from progress p where p.lesson_slug = l.slug and p.status = 'ok') as ok,
      (select count(*) from progress p where p.lesson_slug = l.slug and p.status in ('retry', 'shown') and not p.fixed) as mistakes,
      r.resume_id, r.resume_title, r.resume_index
    from lessons l
    left join lateral (
      select s.value ->> 'id' as resume_id, s.value ->> 'nav' as resume_title, s.ord as resume_index
      from jsonb_array_elements(l.content -> 'sections') with ordinality s(value, ord)
      where exists (
        select 1
        from jsonb_array_elements(s.value -> 'groups') with ordinality g(value, gi),
             jsonb_array_elements(g.value -> 'items') with ordinality i(value, ii)
        where not exists (
          select 1 from progress p
          where p.lesson_slug = l.slug
            and p.item_id = (s.value ->> 'id') || '-' || (g.gi - 1) || '-' || (i.ii - 1)
        )
      )
      order by s.ord
      limit 1
    ) r on true
  ) t;
$$;

create or replace function public.get_lesson(p_slug text)
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select json_build_object(
    'slug', l.slug, 'title', l.title, 'subtitle', l.subtitle, 'content', l.content,
    'progress', coalesce((
      select json_object_agg(p.item_id, json_build_object('status', p.status, 'fixed', p.fixed))
      from progress p where p.lesson_slug = l.slug
    ), '{}'::json)
  )
  from lessons l
  where l.slug = p_slug;
$$;

revoke all on function public.list_lessons(), public.get_lesson(text) from public, anon;
grant execute on function public.list_lessons(), public.get_lesson(text) to authenticated;

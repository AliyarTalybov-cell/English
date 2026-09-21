-- Per-topic statistics for the profile page: how many items are solved, solved first try, and still wrong.
-- security invoker: row level security applies, so each student only sees their own progress.
create or replace function public.profile_stats()
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(json_agg(row_to_json(t) order by t.position, t.title), '[]'::json)
  from (
    select l.slug, l.title, l.subtitle, l.position,
      (
        select json_agg(row_to_json(s2) order by s2.ord)
        from (
          select s.ord,
            s.value ->> 'id' as id,
            s.value ->> 'nav' as nav,
            s.value ->> 'eyebrow' as eyebrow,
            count(*) as total,
            count(p.item_id) as done,
            count(*) filter (where p.status = 'ok') as ok,
            count(*) filter (where p.status in ('retry', 'shown') and not p.fixed) as mistakes
          from jsonb_array_elements(l.content -> 'sections') with ordinality s(value, ord)
          cross join lateral jsonb_array_elements(s.value -> 'groups') with ordinality g(value, gi)
          cross join lateral jsonb_array_elements(g.value -> 'items') with ordinality i(value, ii)
          left join progress p
            on p.lesson_slug = l.slug
           and p.item_id = (s.value ->> 'id') || '-' || (g.gi - 1) || '-' || (i.ii - 1)
          group by s.ord, s.value
        ) s2
      ) as sections
    from lessons l
    where l.published
  ) t;
$$;

revoke all on function public.profile_stats() from public, anon;
grant execute on function public.profile_stats() to authenticated;

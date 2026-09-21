-- list_lessons: also return the first section that still has unsolved items ("continue from").
create or replace function public.list_lessons(p_pin text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v text := _check_pin(p_pin);
begin
  if v <> 'ok' then return json_build_object('error', v); end if;
  return json_build_object('lessons', coalesce((
    select json_agg(row_to_json(t) order by t.position, t.title)
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
      where l.published
    ) t
  ), '[]'::json));
end;
$$;

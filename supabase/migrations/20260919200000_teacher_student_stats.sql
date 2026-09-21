-- Teachers (and the admin): one student's per-topic statistics, the same shape as profile_stats(),
-- plus who the student is. security definer: the role is checked first.
create or replace function public.teacher_student_stats(p_user uuid)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;
  if not exists (select 1 from auth.users where id = p_user) then
    return null;
  end if;
  return (
    select json_build_object(
      'id', u.id,
      'email', u.email::text,
      'avatar_url', u.raw_user_meta_data ->> 'avatar_url',
      'created_at', u.created_at,
      'is_teacher', exists (select 1 from app_admin a where a.user_id = u.id)
                 or exists (select 1 from user_roles r where r.user_id = u.id and r.role = 'teacher'),
      'last_activity', (select max(p.updated_at) from progress p where p.user_id = u.id),
      'lessons', (
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
                  on p.user_id = p_user
                 and p.lesson_slug = l.slug
                 and p.item_id = (s.value ->> 'id') || '-' || (g.gi - 1) || '-' || (i.ii - 1)
                group by s.ord, s.value
              ) s2
            ) as sections
          from lessons l
          where l.published
        ) t
      )
    )
    from auth.users u
    where u.id = p_user
  );
end;
$$;

revoke all on function public.teacher_student_stats(uuid) from public, anon;
grant execute on function public.teacher_student_stats(uuid) to authenticated;

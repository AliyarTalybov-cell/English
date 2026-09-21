-- Learned words (a right answer last time: «Знаю» or the quiz) for «Ваш прогресс» and the teacher's student page.
create or replace function public.list_my_words(p_due_only boolean default false, p_limit int default 50, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 100);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return (
    with mine as (select * from my_words where user_id = v_me),
    picked as (
      select word, ru, streak, due_at, added_at from mine
      where not p_due_only or due_at <= now()
      order by case when p_due_only then due_at else added_at end desc
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from mine),
      'due', (select count(*) from mine where due_at <= now()),
      'learned', (select count(*) from mine where streak >= 1),
      'items', coalesce((select json_agg(row_to_json(p)) from picked p), '[]'::json)
    )
  );
end;
$$;

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
      'last_name', pr.last_name, 'first_name', pr.first_name, 'middle_name', pr.middle_name, 'phone', pr.phone,
      'is_teacher', exists (select 1 from app_admin a where a.user_id = u.id)
                 or exists (select 1 from user_roles r where r.user_id = u.id and r.role = 'teacher'),
      'last_activity', (select max(p.updated_at) from progress p where p.user_id = u.id),
      'words_total', (select count(*) from my_words w where w.user_id = u.id),
      'words_learned', (select count(*) from my_words w where w.user_id = u.id and w.streak >= 1),
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
    left join profiles pr on pr.user_id = u.id
    where u.id = p_user
  );
end;
$$;

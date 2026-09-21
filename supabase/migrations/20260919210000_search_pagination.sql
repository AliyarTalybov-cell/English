-- Search by email and page through «Ученики» and «Пользователи» on the server.
-- Both return {"total": <matches>, "items": [...]}; p_limit is capped at 50.

-- '%' and '_' typed in the search box are matched literally.
create or replace function public._email_pattern(p_query text)
returns text
language sql
immutable
as $$
  select '%' || replace(replace(replace(coalesce(btrim(p_query), ''), '\', '\\'), '%', '\%'), '_', '\_') || '%';
$$;
revoke all on function public._email_pattern(text) from public, anon, authenticated;

drop function if exists public.teacher_list_students();

create or replace function public.teacher_list_students(p_query text default '', p_limit int default 20, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total_items int;
  v_pattern text := public._email_pattern(p_query);
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 50);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;
  select count(*) into v_total_items
  from lessons l, jsonb_path_query(l.content, '$.sections[*].groups[*].items[*]')
  where l.published;
  return (
    with matched as (
      select u.id, u.email::text as email, u.raw_user_meta_data ->> 'avatar_url' as avatar_url, u.created_at
      from auth.users u
      where u.id <> (select auth.uid()) and u.email ilike v_pattern
    ),
    stats as (
      select m.*,
        (exists (select 1 from app_admin a where a.user_id = m.id)
          or exists (select 1 from user_roles r where r.user_id = m.id and r.role = 'teacher')) as is_teacher,
        v_total_items as total,
        count(p.item_id) as done,
        count(*) filter (where p.status = 'ok') as ok,
        count(*) filter (where p.status in ('retry', 'shown') and not p.fixed) as mistakes,
        max(p.updated_at) as last_activity
      from matched m
      left join progress p
        on p.user_id = m.id
       and exists (select 1 from lessons l where l.slug = p.lesson_slug and l.published)
      group by m.id, m.email, m.avatar_url, m.created_at
    ),
    page as (
      select * from stats
      order by last_activity desc nulls last, email, id
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from matched),
      'items', coalesce((select json_agg(row_to_json(page) order by last_activity desc nulls last, email, id) from page), '[]'::json)
    )
  );
end;
$$;

drop function if exists public.admin_list_users();

create or replace function public.admin_list_users(p_query text default '', p_limit int default 20, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pattern text := public._email_pattern(p_query);
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 50);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;
  return (
    with matched as (
      select u.id, u.email::text as email,
        u.raw_user_meta_data ->> 'avatar_url' as avatar_url,
        u.created_at, u.last_sign_in_at,
        exists (select 1 from app_admin a where a.user_id = u.id) as is_admin,
        exists (select 1 from user_roles r where r.user_id = u.id and r.role = 'teacher') as is_teacher
      from auth.users u
      where u.email ilike v_pattern
    ),
    page as (
      select * from matched
      order by is_admin desc, email, id
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from matched),
      'users', (select count(*) from auth.users),
      'teachers', (select count(*) from app_admin) + (select count(*) from user_roles where role = 'teacher'),
      'items', coalesce((select json_agg(row_to_json(page) order by is_admin desc, email, id) from page), '[]'::json)
    )
  );
end;
$$;

revoke all on function public.teacher_list_students(text, int, int), public.admin_list_users(text, int, int) from public, anon;
grant execute on function public.teacher_list_students(text, int, int), public.admin_list_users(text, int, int) to authenticated;

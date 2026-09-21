-- Teachers (and the admin): every other participant with a short summary of their progress.
-- security definer: reads everyone's progress, so the role is checked first.
create or replace function public.teacher_list_students()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total int;
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;
  select count(*) into v_total
  from lessons l, jsonb_path_query(l.content, '$.sections[*].groups[*].items[*]')
  where l.published;
  return (
    select coalesce(json_agg(row_to_json(t) order by t.last_activity desc nulls last, t.email), '[]'::json)
    from (
      select u.id, u.email::text as email,
        u.raw_user_meta_data ->> 'avatar_url' as avatar_url,
        u.created_at,
        (exists (select 1 from app_admin a where a.user_id = u.id)
          or exists (select 1 from user_roles r where r.user_id = u.id and r.role = 'teacher')) as is_teacher,
        v_total as total,
        count(p.item_id) as done,
        count(*) filter (where p.status = 'ok') as ok,
        count(*) filter (where p.status in ('retry', 'shown') and not p.fixed) as mistakes,
        max(p.updated_at) as last_activity
      from auth.users u
      left join progress p
        on p.user_id = u.id
       and exists (select 1 from lessons l where l.slug = p.lesson_slug and l.published)
      where u.id <> (select auth.uid())
      group by u.id
    ) t
  );
end;
$$;

revoke all on function public.teacher_list_students() from public, anon;
grant execute on function public.teacher_list_students() to authenticated;

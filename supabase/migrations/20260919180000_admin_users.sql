-- The browser treats "permission denied" as an expired session and signs out,
-- so admin checks say "admin only" instead.
create or replace function public.admin_set_teacher(p_user uuid, p_on boolean)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;
  if exists (select 1 from app_admin where user_id = p_user) then
    raise exception 'the admin is always a teacher' using errcode = '22023';
  end if;
  if not exists (select 1 from auth.users where id = p_user) then
    raise exception 'user not found' using errcode = 'P0002';
  end if;
  if p_on then
    insert into user_roles (user_id, role) values (p_user, 'teacher') on conflict (user_id) do nothing;
  else
    delete from user_roles where user_id = p_user;
  end if;
end;
$$;

-- Admin only: every registered user with their role, for the «Пользователи» screen.
create or replace function public.admin_list_users()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;
  return (
    select coalesce(json_agg(row_to_json(t) order by t.is_admin desc, t.email), '[]'::json)
    from (
      select u.id, u.email::text as email,
        u.raw_user_meta_data ->> 'avatar_url' as avatar_url,
        u.created_at, u.last_sign_in_at,
        exists (select 1 from app_admin a where a.user_id = u.id) as is_admin,
        exists (select 1 from user_roles r where r.user_id = u.id and r.role = 'teacher') as is_teacher
      from auth.users u
    ) t
  );
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

-- Roles: the admin (the site owner) can make any user a teacher and take the role back.
-- The admin is pinned by user id, not by email: email is not confirmed at sign-up, so an email check
-- could be taken over if the account were ever deleted and registered again.
-- Tables are closed to the browser (RLS on, no policies); everything goes through the functions below.

create table public.app_admin (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.app_admin enable row level security;

insert into public.app_admin (user_id)
select id from auth.users where email = 'aliyartalybov@icloud.com';

do $$
begin
  if not exists (select 1 from public.app_admin) then
    raise exception 'admin account aliyartalybov@icloud.com not found';
  end if;
end $$;

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role = 'teacher'),
  granted_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from app_admin where user_id = (select auth.uid()));
$$;

-- The admin is a teacher too, without a row in user_roles.
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
      or exists (select 1 from user_roles where user_id = (select auth.uid()) and role = 'teacher');
$$;

-- For the account menu: 'admin', 'teacher' or null.
create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case when public.is_admin() then 'admin' when public.is_teacher() then 'teacher' end;
$$;

-- Admin only: give (p_on = true) or take away (false) the teacher role.
create or replace function public.admin_set_teacher(p_user uuid, p_on boolean)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'permission denied' using errcode = '42501';
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

revoke all on function public.is_admin(), public.is_teacher(), public.my_role(), public.admin_set_teacher(uuid, boolean) from public, anon;
grant execute on function public.is_admin(), public.is_teacher(), public.my_role(), public.admin_set_teacher(uuid, boolean) to authenticated;

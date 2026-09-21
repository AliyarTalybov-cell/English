-- Personal details: surname, first name, patronymic (optional) and phone. All optional.
-- The owner reads and edits them; teachers and the admin read them (student pages, lists, search).
-- A student sees a teacher's name in their chat, never a phone.

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_name text check (char_length(last_name) between 1 and 60),
  first_name text check (char_length(first_name) between 1 and 60),
  middle_name text check (char_length(middle_name) between 1 and 60),
  phone text check (phone ~ '^\+[0-9]{10,15}$'),  -- stored as + and digits only
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function public.get_my_profile()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select json_build_object('last_name', last_name, 'first_name', first_name, 'middle_name', middle_name, 'phone', phone)
     from profiles where user_id = (select auth.uid())),
    json_build_object('last_name', null, 'first_name', null, 'middle_name', null, 'phone', null));
$$;

-- Empty strings clear a field. The phone arrives as typed; only + and digits are kept.
create or replace function public.update_my_profile(p_last_name text, p_first_name text, p_middle_name text, p_phone text)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_last text := nullif(btrim(coalesce(p_last_name, '')), '');
  v_first text := nullif(btrim(coalesce(p_first_name, '')), '');
  v_middle text := nullif(btrim(coalesce(p_middle_name, '')), '');
  v_phone text := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), '');
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if greatest(char_length(v_last), char_length(v_first), char_length(v_middle)) > 60 then
    raise exception 'name too long' using errcode = '22023';
  end if;
  if v_phone is not null and v_phone !~ '^\+[0-9]{10,15}$' then
    raise exception 'bad phone' using errcode = '22023';
  end if;
  insert into profiles (user_id, last_name, first_name, middle_name, phone, updated_at)
  values (v_me, v_last, v_first, v_middle, v_phone, now())
  on conflict (user_id) do update set last_name = excluded.last_name, first_name = excluded.first_name,
    middle_name = excluded.middle_name, phone = excluded.phone, updated_at = now();
  return public.get_my_profile();
end;
$$;

-- Search in «Ученики» and «Пользователи»: email, surname, name, patronymic, or phone digits.
create or replace function public._matches(p_email text, p profiles, p_query text)
returns boolean
language sql
immutable
as $$
  select btrim(coalesce(p_query, '')) = ''
      or p_email ilike public._email_pattern(p_query)
      or coalesce(p.last_name, '') ilike public._email_pattern(p_query)
      or coalesce(p.first_name, '') ilike public._email_pattern(p_query)
      or coalesce(p.middle_name, '') ilike public._email_pattern(p_query)
      or concat_ws(' ', p.first_name, p.last_name) ilike public._email_pattern(p_query)
      or concat_ws(' ', p.last_name, p.first_name, p.middle_name) ilike public._email_pattern(p_query)
      or (char_length(regexp_replace(p_query, '[^0-9]', '', 'g')) >= 3
          and coalesce(p.phone, '') like '%' || regexp_replace(p_query, '[^0-9]', '', 'g') || '%');
$$;
revoke all on function public._matches(text, profiles, text) from public, anon, authenticated;

-- Chat cards get the name; the phone only when a teacher is looking.
create or replace function public._user_card(p_user uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object('id', u.id, 'email', u.email::text, 'avatar_url', u.raw_user_meta_data ->> 'avatar_url',
    'last_name', pr.last_name, 'first_name', pr.first_name,
    'phone', case when public.is_teacher() then pr.phone end)
  from auth.users u left join profiles pr on pr.user_id = u.id
  where u.id = p_user;
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

create or replace function public.teacher_list_students(p_query text default '', p_limit int default 20, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total_items int;
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
      select u.id, u.email::text as email, u.raw_user_meta_data ->> 'avatar_url' as avatar_url, u.created_at,
        pr.last_name, pr.first_name, pr.middle_name, pr.phone
      from auth.users u
      left join profiles pr on pr.user_id = u.id
      where u.id <> (select auth.uid()) and public._matches(u.email::text, pr, p_query)
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
      group by m.id, m.email, m.avatar_url, m.created_at, m.last_name, m.first_name, m.middle_name, m.phone
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

create or replace function public.admin_list_users(p_query text default '', p_limit int default 20, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
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
        pr.last_name, pr.first_name, pr.middle_name, pr.phone,
        exists (select 1 from app_admin a where a.user_id = u.id) as is_admin,
        exists (select 1 from user_roles r where r.user_id = u.id and r.role = 'teacher') as is_teacher
      from auth.users u
      left join profiles pr on pr.user_id = u.id
      where public._matches(u.email::text, pr, p_query)
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

revoke all on function public.get_my_profile(), public.update_my_profile(text, text, text, text) from public, anon;
grant execute on function public.get_my_profile(), public.update_my_profile(text, text, text, text) to authenticated;

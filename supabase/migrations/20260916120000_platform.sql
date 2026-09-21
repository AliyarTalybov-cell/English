-- English platform: lessons, progress, PIN-protected access through RPC only.

create extension if not exists pgcrypto with schema extensions;

create table public.app_secret (
  id int primary key default 1 check (id = 1),
  pin_hash text not null
);

create table public.lessons (
  slug text primary key,
  title text not null,
  subtitle text,
  position int not null default 0,
  published boolean not null default true,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.progress (
  lesson_slug text not null references public.lessons(slug) on delete cascade on update cascade,
  item_id text not null,
  status text not null check (status in ('ok', 'retry', 'shown')),
  fixed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (lesson_slug, item_id)
);

create table public.pin_attempts (
  id bigserial primary key,
  ip text not null,
  created_at timestamptz not null default now()
);
create index pin_attempts_ip_time on public.pin_attempts (ip, created_at);

-- No direct table access for the browser: RLS on, no policies, grants revoked.
alter table public.app_secret enable row level security;
alter table public.lessons enable row level security;
alter table public.progress enable row level security;
alter table public.pin_attempts enable row level security;
revoke all on public.app_secret, public.lessons, public.progress, public.pin_attempts from anon, authenticated;

-- Internal: returns 'ok', 'bad_pin' or 'locked'. Never raises, so a failed attempt is committed.
-- 5 failures in 15 minutes from one IP lock that IP.
create or replace function public._check_pin(p_pin text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_ip text := coalesce(
    nullif(trim(split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1)), ''),
    'unknown');
begin
  if (select count(*) from pin_attempts where ip = v_ip and created_at > now() - interval '15 minutes') >= 5 then
    return 'locked';
  end if;
  if not exists (select 1 from app_secret where pin_hash = crypt(coalesce(p_pin, ''), pin_hash)) then
    insert into pin_attempts (ip) values (v_ip);
    return 'bad_pin';
  end if;
  delete from pin_attempts where ip = v_ip;
  return 'ok';
end;
$$;
revoke all on function public._check_pin(text) from public, anon, authenticated;

create or replace function public.verify_pin(p_pin text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v text := _check_pin(p_pin);
begin
  if v <> 'ok' then return json_build_object('error', v); end if;
  return json_build_object('ok', true);
end;
$$;

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
        (select count(*) from progress p where p.lesson_slug = l.slug and p.status in ('retry', 'shown') and not p.fixed) as mistakes
      from lessons l
      where l.published
    ) t
  ), '[]'::json));
end;
$$;

create or replace function public.get_lesson(p_pin text, p_slug text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v text := _check_pin(p_pin); r json;
begin
  if v <> 'ok' then return json_build_object('error', v); end if;
  select json_build_object(
    'slug', l.slug, 'title', l.title, 'subtitle', l.subtitle, 'content', l.content,
    'progress', coalesce((
      select json_object_agg(p.item_id, json_build_object('status', p.status, 'fixed', p.fixed))
      from progress p where p.lesson_slug = l.slug
    ), '{}'::json)
  ) into r
  from lessons l
  where l.slug = p_slug and l.published;
  if r is null then return json_build_object('error', 'not_found'); end if;
  return r;
end;
$$;

create or replace function public.save_status(p_pin text, p_slug text, p_item text, p_status text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v text := _check_pin(p_pin);
begin
  if v <> 'ok' then return json_build_object('error', v); end if;
  insert into progress (lesson_slug, item_id, status, fixed, updated_at)
  values (p_slug, p_item, p_status, false, now())
  on conflict (lesson_slug, item_id)
  do update set status = excluded.status, fixed = false, updated_at = now();
  return json_build_object('ok', true);
end;
$$;

create or replace function public.mark_fixed(p_pin text, p_slug text, p_item text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v text := _check_pin(p_pin);
begin
  if v <> 'ok' then return json_build_object('error', v); end if;
  update progress set fixed = true, updated_at = now()
  where lesson_slug = p_slug and item_id = p_item;
  return json_build_object('ok', true);
end;
$$;

create or replace function public.reset_section(p_pin text, p_slug text, p_section text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v text := _check_pin(p_pin);
begin
  if v <> 'ok' then return json_build_object('error', v); end if;
  delete from progress
  where lesson_slug = p_slug and item_id like p_section || '-%';
  return json_build_object('ok', true);
end;
$$;

revoke all on function public.verify_pin(text), public.list_lessons(text), public.get_lesson(text, text),
  public.save_status(text, text, text, text), public.mark_fixed(text, text, text), public.reset_section(text, text, text)
  from public;
grant execute on function public.verify_pin(text), public.list_lessons(text), public.get_lesson(text, text),
  public.save_status(text, text, text, text), public.mark_fixed(text, text, text), public.reset_section(text, text, text)
  to anon, authenticated;

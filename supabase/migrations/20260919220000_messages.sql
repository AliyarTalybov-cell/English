-- Messages between a teacher and a student. One dialog per pair of users: it is started by a teacher,
-- after that both sides write into it. The table is closed to the browser (RLS on, no policies);
-- everything goes through the functions below, which only ever touch the caller's own dialogs.
-- Errors say "not allowed" rather than "permission denied": the site treats the latter as an expired session.

create table public.messages (
  id bigint generated always as identity primary key,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (teacher_id <> student_id),
  check (sender_id in (teacher_id, student_id))
);
alter table public.messages enable row level security;
create index messages_dialog on public.messages (teacher_id, student_id, id desc);
create index messages_student on public.messages (student_id, id desc);
create index messages_unread on public.messages (teacher_id, student_id) where read_at is null;

-- The dialog between the caller and p_other, whichever side started it: (teacher_id, student_id) or null.
create or replace function public._dialog_with(p_other uuid, out teacher_id uuid, out student_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select m.teacher_id, m.student_id
  from messages m
  where (m.teacher_id = (select auth.uid()) and m.student_id = p_other)
     or (m.teacher_id = p_other and m.student_id = (select auth.uid()))
  limit 1;
$$;

create or replace function public._user_card(p_user uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object('id', u.id, 'email', u.email::text, 'avatar_url', u.raw_user_meta_data ->> 'avatar_url')
  from auth.users u where u.id = p_user;
$$;

-- Send a message to p_to. Goes into the existing dialog; a new dialog can only be started by a teacher.
create or replace function public.send_message(p_to uuid, p_body text)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_body text := btrim(coalesce(p_body, ''));
  v_teacher uuid;
  v_student uuid;
  v_row messages;
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if p_to is null or p_to = v_me or not exists (select 1 from auth.users where id = p_to) then
    raise exception 'user not found' using errcode = 'P0002';
  end if;
  if char_length(v_body) = 0 then
    raise exception 'empty message' using errcode = '22023';
  end if;
  if char_length(v_body) > 2000 then
    raise exception 'message too long' using errcode = '22023';
  end if;
  -- Simple flood guard: at most 20 messages a minute from one person.
  if (select count(*) from messages where sender_id = v_me and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'too many messages' using errcode = '54000';
  end if;

  select d.teacher_id, d.student_id into v_teacher, v_student from public._dialog_with(p_to) d;
  if v_teacher is null then
    if not public.is_teacher() then
      raise exception 'not allowed: only a teacher can start a dialog' using errcode = '42501';
    end if;
    v_teacher := v_me;
    v_student := p_to;
  end if;

  insert into messages (teacher_id, student_id, sender_id, body)
  values (v_teacher, v_student, v_me, v_body)
  returning * into v_row;

  return json_build_object('id', v_row.id, 'mine', true, 'body', v_row.body, 'created_at', v_row.created_at, 'read_at', v_row.read_at);
end;
$$;

-- Messages with p_with, newest first. p_before: older page (ids below it); p_after: only new ones (ids above it).
-- A teacher may open an empty dialog with anyone; others only an existing one.
create or replace function public.get_messages(p_with uuid, p_before bigint default null, p_after bigint default null, p_limit int default 30)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_teacher uuid;
  v_student uuid;
  v_limit int := least(greatest(coalesce(p_limit, 30), 1), 100);
begin
  if v_me is null or p_with is null or p_with = v_me then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  select d.teacher_id, d.student_id into v_teacher, v_student from public._dialog_with(p_with) d;
  if v_teacher is null and not public.is_teacher() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if not exists (select 1 from auth.users where id = p_with) then
    raise exception 'user not found' using errcode = 'P0002';
  end if;
  return (
    with page as (
      select m.id, m.sender_id = v_me as mine, m.body, m.created_at, m.read_at
      from messages m
      where v_teacher is not null
        and m.teacher_id = v_teacher and m.student_id = v_student
        and (p_before is null or m.id < p_before)
        and (p_after is null or m.id > p_after)
      order by m.id desc
      limit v_limit + 1
    )
    select json_build_object(
      'with', public._user_card(p_with),
      'can_write', v_teacher is not null or public.is_teacher(),
      'has_more', (select count(*) from page) > v_limit,
      'items', coalesce((select json_agg(row_to_json(t) order by t.id desc)
                         from (select * from page order by id desc limit v_limit) t), '[]'::json)
    )
  );
end;
$$;

-- Mark everything p_with sent to the caller as read. Returns how many messages were marked.
create or replace function public.mark_read(p_with uuid)
returns int
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_n int;
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update messages m set read_at = now()
  where m.read_at is null
    and m.sender_id = p_with
    and ((m.teacher_id = v_me and m.student_id = p_with) or (m.teacher_id = p_with and m.student_id = v_me));
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

-- Unread messages addressed to the caller, for the badge on the avatar.
create or replace function public.unread_count()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
  from messages m
  where m.read_at is null
    and m.sender_id <> (select auth.uid())
    and (m.teacher_id = (select auth.uid()) or m.student_id = (select auth.uid()));
$$;

-- The caller's dialogs, most recent first: who, the last message and how many are unread.
create or replace function public.list_dialogs(p_limit int default 20, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 50);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return (
    with mine as (
      select m.*, case when m.teacher_id = v_me then m.student_id else m.teacher_id end as other,
             m.teacher_id = v_me as i_am_teacher
      from messages m
      where m.teacher_id = v_me or m.student_id = v_me
    ),
    dialogs as (
      select distinct on (other) other, i_am_teacher, id as last_id, body as last_body,
             created_at as last_at, sender_id = v_me as last_mine
      from mine
      order by other, id desc
    ),
    page as (
      select d.*,
        (select count(*) from mine x where x.other = d.other and x.read_at is null and x.sender_id <> v_me) as unread
      from dialogs d
      order by d.last_id desc
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from dialogs),
      'items', coalesce((
        select json_agg(json_build_object(
          'with', public._user_card(p.other),
          'i_am_teacher', p.i_am_teacher,
          'last_body', left(p.last_body, 200),
          'last_at', p.last_at,
          'last_mine', p.last_mine,
          'unread', p.unread
        ) order by p.last_id desc)
        from page p), '[]'::json)
    )
  );
end;
$$;

revoke all on function public._dialog_with(uuid), public._user_card(uuid) from public, anon, authenticated;
revoke all on function public.send_message(uuid, text), public.get_messages(uuid, bigint, bigint, int),
  public.mark_read(uuid), public.unread_count(), public.list_dialogs(int, int) from public, anon;
grant execute on function public.send_message(uuid, text), public.get_messages(uuid, bigint, bigint, int),
  public.mark_read(uuid), public.unread_count(), public.list_dialogs(int, int) to authenticated;

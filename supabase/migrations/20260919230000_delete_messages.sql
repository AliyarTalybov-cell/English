-- Deleting: «Удалить чат» hides the dialog only for the one who deletes it (everything up to that moment);
-- «Стереть сообщение» removes one's own message for both sides, with no trace.

create table public.dialog_clears (
  user_id uuid not null references auth.users(id) on delete cascade,
  other_id uuid not null references auth.users(id) on delete cascade,
  cleared_upto bigint not null,  -- messages with id <= this are hidden for user_id
  primary key (user_id, other_id)
);
alter table public.dialog_clears enable row level security;

create or replace function public._cleared_upto(p_other uuid)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select cleared_upto from dialog_clears where user_id = (select auth.uid()) and other_id = p_other), 0);
$$;

-- Erase one of my own messages, for both sides.
create or replace function public.delete_message(p_id bigint)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  delete from messages where id = p_id and sender_id = (select auth.uid());
  if not found then
    raise exception 'not allowed' using errcode = '42501';
  end if;
end;
$$;

-- Hide the whole dialog with p_with for me; it comes back only with messages sent after this.
create or replace function public.clear_dialog(p_with uuid)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_teacher uuid;
  v_student uuid;
  v_last bigint;
begin
  select d.teacher_id, d.student_id into v_teacher, v_student from public._dialog_with(p_with) d;
  if v_me is null or v_teacher is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  select coalesce(max(id), 0) into v_last from messages where teacher_id = v_teacher and student_id = v_student;
  insert into dialog_clears (user_id, other_id, cleared_upto) values (v_me, p_with, v_last)
  on conflict (user_id, other_id) do update set cleared_upto = excluded.cleared_upto;
  -- Hidden messages should not keep the unread badge lit.
  update messages set read_at = now()
  where teacher_id = v_teacher and student_id = v_student and sender_id = p_with and read_at is null;
end;
$$;

-- get_messages gains p_alive_from: when set, also returns which of the messages from that id on still exist
-- (and their read_at), so an open chat can drop erased messages and update «Прочитано» in one call.
drop function if exists public.get_messages(uuid, bigint, bigint, int);
create or replace function public.get_messages(p_with uuid, p_before bigint default null, p_after bigint default null,
                                               p_limit int default 30, p_alive_from bigint default null)
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
  v_hidden bigint := public._cleared_upto(p_with);
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
    with visible as (
      select m.* from messages m
      where v_teacher is not null
        and m.teacher_id = v_teacher and m.student_id = v_student
        and m.id > v_hidden
    ),
    page as (
      select v.id, v.sender_id = v_me as mine, v.body, v.created_at, v.read_at
      from visible v
      where (p_before is null or v.id < p_before)
        and (p_after is null or v.id > p_after)
      order by v.id desc
      limit v_limit + 1
    )
    select json_build_object(
      'with', public._user_card(p_with),
      'can_write', v_teacher is not null or public.is_teacher(),
      'has_more', (select count(*) from page) > v_limit,
      'items', coalesce((select json_agg(row_to_json(t) order by t.id desc)
                         from (select * from page order by id desc limit v_limit) t), '[]'::json),
      'alive', case when p_alive_from is null then null else coalesce((
                 select json_agg(json_build_object('id', a.id, 'read_at', a.read_at) order by a.id)
                 from (select id, read_at from visible where id >= p_alive_from order by id limit 2000) a), '[]'::json) end
    )
  );
end;
$$;

create or replace function public.unread_count()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
  from messages m
  left join dialog_clears c
    on c.user_id = (select auth.uid()) and c.other_id = m.sender_id
  where m.read_at is null
    and m.sender_id <> (select auth.uid())
    and (m.teacher_id = (select auth.uid()) or m.student_id = (select auth.uid()))
    and m.id > coalesce(c.cleared_upto, 0);
$$;

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
      select m.*, x.other, m.teacher_id = v_me as i_am_teacher
      from messages m
      cross join lateral (select case when m.teacher_id = v_me then m.student_id else m.teacher_id end as other) x
      left join dialog_clears c on c.user_id = v_me and c.other_id = x.other
      where (m.teacher_id = v_me or m.student_id = v_me)
        and m.id > coalesce(c.cleared_upto, 0)
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

revoke all on function public._cleared_upto(uuid) from public, anon, authenticated;
revoke all on function public.delete_message(bigint), public.clear_dialog(uuid),
  public.get_messages(uuid, bigint, bigint, int, bigint) from public, anon;
grant execute on function public.delete_message(bigint), public.clear_dialog(uuid),
  public.get_messages(uuid, bigint, bigint, int, bigint) to authenticated;

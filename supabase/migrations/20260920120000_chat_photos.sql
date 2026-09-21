-- Photos in chat: one photo per message, with an optional caption.
-- Files live in the private bucket «chat» as <sender id>/<random>.jpg. Only the sender and the other side
-- of the dialog can read a file; the site shows it through a signed link that expires in an hour.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat', 'chat', false, 2097152, array['image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

alter table public.messages add column image_path text;
alter table public.messages drop constraint messages_body_check;
alter table public.messages add constraint messages_body_check
  check (char_length(body) <= 2000 and (image_path is not null or char_length(btrim(body)) >= 1));
create index messages_image on public.messages (image_path) where image_path is not null;

-- Storage policies can't read the closed messages table themselves, so they ask this function.
create or replace function public.can_see_chat_image(p_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from messages m
    where m.image_path = p_name
      and (m.teacher_id = (select auth.uid()) or m.student_id = (select auth.uid()))
  );
$$;
revoke all on function public.can_see_chat_image(text) from public, anon;
grant execute on function public.can_see_chat_image(text) to authenticated;

create policy "chat upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'chat' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "chat read own or dialog" on storage.objects for select to authenticated
  using (bucket_id = 'chat' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.can_see_chat_image(name)));
create policy "chat delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'chat' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- send_message gains p_image: a path the sender has just uploaded to «chat».
drop function if exists public.send_message(uuid, text);
create or replace function public.send_message(p_to uuid, p_body text, p_image text default null)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_body text := btrim(coalesce(p_body, ''));
  v_image text := nullif(btrim(coalesce(p_image, '')), '');
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
  if char_length(v_body) = 0 and v_image is null then
    raise exception 'empty message' using errcode = '22023';
  end if;
  if char_length(v_body) > 2000 then
    raise exception 'message too long' using errcode = '22023';
  end if;
  if v_image is not null and (
       v_image !~ ('^' || v_me::text || '/[A-Za-z0-9_-]+\.jpg$')
       or not exists (select 1 from storage.objects o where o.bucket_id = 'chat' and o.name = v_image)
       or exists (select 1 from messages where image_path = v_image)) then
    raise exception 'bad image' using errcode = '22023';
  end if;
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

  insert into messages (teacher_id, student_id, sender_id, body, image_path)
  values (v_teacher, v_student, v_me, v_body, v_image)
  returning * into v_row;

  return json_build_object('id', v_row.id, 'mine', true, 'body', v_row.body, 'image_path', v_row.image_path,
                           'created_at', v_row.created_at, 'read_at', v_row.read_at);
end;
$$;

-- delete_message now returns the photo path (or null) so the site can remove the file from storage.
drop function if exists public.delete_message(bigint);
create or replace function public.delete_message(p_id bigint)
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_path text;
begin
  delete from messages where id = p_id and sender_id = (select auth.uid())
  returning image_path into v_path;
  if not found then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return v_path;
end;
$$;

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
      select v.id, v.sender_id = v_me as mine, v.body, v.image_path, v.created_at, v.read_at
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
      select distinct on (other) other, i_am_teacher, id as last_id, body as last_body, image_path is not null as last_image,
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
          'last_image', p.last_image,
          'last_at', p.last_at,
          'last_mine', p.last_mine,
          'unread', p.unread
        ) order by p.last_id desc)
        from page p), '[]'::json)
    )
  );
end;
$$;

revoke all on function public.send_message(uuid, text, text), public.delete_message(bigint) from public, anon;
grant execute on function public.send_message(uuid, text, text), public.delete_message(bigint) to authenticated;

-- list_dialogs used to scan every message of the caller. Now it first collects the people it talks to,
-- then takes the last message and the unread count for each through the index, so the work grows with the
-- number of dialogs, not with the number of messages.
create index if not exists messages_teacher_student on public.messages (teacher_id, student_id);
create index if not exists messages_student_teacher on public.messages (student_id, teacher_id);
create index if not exists messages_unread_to_me on public.messages (student_id, teacher_id, sender_id) where read_at is null;

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
    with partners as (
      select distinct student_id as other, true as i_am_teacher from messages where teacher_id = v_me
      union
      select distinct teacher_id as other, false as i_am_teacher from messages where student_id = v_me
    ),
    cleared as (
      select p.other, p.i_am_teacher,
        coalesce((select c.cleared_upto from dialog_clears c where c.user_id = v_me and c.other_id = p.other), 0) as hidden
      from partners p
    ),
    last_msg as (
      select c.other, c.i_am_teacher, c.hidden, m.id as last_id, m.body as last_body, m.image_path is not null as last_image,
             m.created_at as last_at, m.sender_id = v_me as last_mine
      from cleared c
      cross join lateral (
        select id, body, image_path, created_at, sender_id
        from messages m
        where ((m.teacher_id = v_me and m.student_id = c.other) or (m.teacher_id = c.other and m.student_id = v_me))
          and m.id > c.hidden
        order by m.id desc
        limit 1
      ) m
    ),
    page as (
      select l.*,
        (select count(*) from messages x
          where ((x.teacher_id = v_me and x.student_id = l.other) or (x.teacher_id = l.other and x.student_id = v_me))
            and x.read_at is null and x.sender_id <> v_me and x.id > l.hidden) as unread
      from last_msg l
      order by l.last_id desc
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from last_msg),
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

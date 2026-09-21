-- Teachers add words to a student's «Мои слова» from the student's page.
-- added_by marks a word the teacher added; the student sees it under «От учителя» until the first training answer.
alter table public.my_words add column if not exists added_by uuid references auth.users(id) on delete set null;

create or replace function public.list_my_words(p_due_only boolean default false, p_limit int default 50, p_offset int default 0)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 100);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return (
    with mine as (select * from my_words where user_id = v_me),
    picked as (
      select word, ru, streak, due_at, added_at, added_by is not null as from_teacher from mine
      where not p_due_only or due_at <= now()
      order by case when p_due_only then due_at else added_at end desc
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from mine),
      'due', (select count(*) from mine where due_at <= now()),
      'learned', (select count(*) from mine where streak >= 1),
      'items', coalesce((select json_agg(row_to_json(p)) from picked p), '[]'::json)
    )
  );
end;
$$;

-- The first training answer takes a word out of «От учителя».
create or replace function public.word_result(p_word text, p_ok boolean)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_word text := btrim(lower(coalesce(p_word, '')));
  v_streak int;
begin
  select streak into v_streak from my_words where user_id = v_me and word = v_word;
  if v_streak is null then
    raise exception 'word not found' using errcode = 'P0002';
  end if;
  v_streak := case when p_ok then v_streak + 1 else 0 end;
  update my_words
  set streak = v_streak, due_at = now() + (public._review_gap(v_streak) || ' days')::interval, added_by = null
  where user_id = v_me and word = v_word;
end;
$$;

-- Add or update words for a student: p_items is [{ "word": "kitchen", "ru": "кухня" }, ...].
-- An existing word keeps its progress and only gets the new translation.
create or replace function public.teacher_add_words(p_user uuid, p_items jsonb)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_item jsonb;
  v_word text;
  v_ru text;
  v_added int := 0;
  v_updated int := 0;
  v_skipped int := 0;
  v_count int;
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;
  if not exists (select 1 from auth.users where id = p_user) then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 200 then
    raise exception 'bad items' using errcode = '22023';
  end if;
  select count(*) into v_count from my_words where user_id = p_user;
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_word := nullif(btrim(lower(coalesce(v_item ->> 'word', ''))), '');
    v_ru := nullif(btrim(coalesce(v_item ->> 'ru', '')), '');
    if v_word is null or v_ru is null or char_length(v_word) > 60 or char_length(v_ru) > 200 then
      v_skipped := v_skipped + 1;
      continue;
    end if;
    if exists (select 1 from my_words where user_id = p_user and word = v_word) then
      update my_words set ru = v_ru where user_id = p_user and word = v_word;
      v_updated := v_updated + 1;
    elsif v_count >= 500 then
      v_skipped := v_skipped + 1;
    else
      insert into my_words (user_id, word, ru, added_by) values (p_user, v_word, v_ru, v_me);
      v_added := v_added + 1;
      v_count := v_count + 1;
    end if;
  end loop;
  return json_build_object('added', v_added, 'updated', v_updated, 'skipped', v_skipped);
end;
$$;

-- A student's words for the teacher, newest first.
create or replace function public.teacher_student_words(p_user uuid)
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
  return (
    select json_build_object(
      'total', count(*),
      'learned', count(*) filter (where streak >= 1),
      'items', coalesce(json_agg(json_build_object(
        'word', word, 'ru', ru, 'streak', streak, 'due_at', due_at, 'added_at', added_at, 'from_teacher', added_by is not null
      ) order by added_at desc), '[]'::json)
    )
    from my_words where user_id = p_user
  );
end;
$$;

create or replace function public.teacher_remove_word(p_user uuid, p_word text)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;
  delete from my_words where user_id = p_user and word = btrim(lower(coalesce(p_word, '')));
end;
$$;

revoke all on function public.teacher_add_words(uuid, jsonb), public.teacher_student_words(uuid), public.teacher_remove_word(uuid, text) from public, anon;
grant execute on function public.teacher_add_words(uuid, jsonb), public.teacher_student_words(uuid), public.teacher_remove_word(uuid, text) to authenticated;

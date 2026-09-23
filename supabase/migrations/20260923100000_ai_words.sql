-- «Подобрать слова с ИИ» in «Мои слова»: the `words` Edge Function asks the model for 20 important words
-- of a topic and adds them here. At most 60 words from the AI stay in a dictionary at a time;
-- to get more, the student removes old ones. Words the AI has already given are remembered,
-- so the next 20 do not repeat them even after they were removed.

alter table public.my_words add column if not exists from_ai boolean not null default false;

create table if not exists public.ai_words_given (
  user_id uuid not null references auth.users (id) on delete cascade,
  word text not null,
  topic text not null,
  given_at timestamptz not null default now(),
  primary key (user_id, word)
);
alter table public.ai_words_given enable row level security;
-- No policies: the table is reached only through the functions below.

-- Words from the AI a dictionary may hold at once.
create or replace function public.ai_words_limit()
returns int
language sql
immutable
as $$ select 60 $$;

-- What the Edge Function needs before asking the model: how many AI words are in the dictionary
-- and which words must not come again (everything in the dictionary and everything given before).
create or replace function public.ai_words_state()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return json_build_object(
    'ai_total', (select count(*) from my_words where user_id = v_me and from_ai),
    'limit', public.ai_words_limit(),
    'exclude', coalesce((
      select json_agg(w) from (
        select word as w from my_words where user_id = v_me
        union
        select word from ai_words_given where user_id = v_me
      ) x
    ), '[]'::json)
  );
end;
$$;

-- Adds the words the model gave: skips words already in the dictionary, stops at the AI limit
-- and at the dictionary's 500 words. Returns the words actually added.
create or replace function public.add_ai_words(p_items jsonb, p_topic text)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_topic text := left(btrim(coalesce(p_topic, '')), 60);
  v_item jsonb;
  v_word text;
  v_ru text;
  v_room int;
  v_added text[] := '{}';
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 40 then
    raise exception 'bad items' using errcode = '22023';
  end if;
  v_room := least(
    public.ai_words_limit() - (select count(*) from my_words where user_id = v_me and from_ai),
    500 - (select count(*) from my_words where user_id = v_me),
    20);
  for v_item in select * from jsonb_array_elements(p_items) loop
    exit when v_room <= 0;
    v_word := nullif(btrim(lower(coalesce(v_item ->> 'word', ''))), '');
    v_ru := nullif(btrim(coalesce(v_item ->> 'ru', '')), '');
    continue when v_word is null or v_ru is null or char_length(v_word) > 60 or char_length(v_ru) > 200;
    insert into my_words (user_id, word, ru, from_ai) values (v_me, v_word, v_ru, true)
    on conflict (user_id, word) do nothing;
    continue when not found;
    insert into ai_words_given (user_id, word, topic) values (v_me, v_word, v_topic)
    on conflict (user_id, word) do nothing;
    v_added := v_added || v_word;
    v_room := v_room - 1;
  end loop;
  return json_build_object(
    'added', to_json(v_added),
    'ai_total', (select count(*) from my_words where user_id = v_me and from_ai)
  );
end;
$$;

-- «Вернуть» right after adding: the words leave the dictionary and are forgotten as given,
-- so the AI may offer them again.
create or replace function public.undo_ai_words(p_words text[])
returns void
language sql
volatile
security definer
set search_path = public
as $$
  delete from my_words where user_id = (select auth.uid()) and from_ai and word = any (p_words);
  delete from ai_words_given where user_id = (select auth.uid()) and word = any (p_words);
$$;

-- «Мои слова» also shows how many words came from the AI.
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
      select word, ru, streak, due_at, added_at, added_by is not null as from_teacher, from_ai from mine
      where not p_due_only or due_at <= now()
      order by case when p_due_only then due_at else added_at end desc
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from mine),
      'due', (select count(*) from mine where due_at <= now()),
      'learned', (select count(*) from mine where streak >= 1),
      'ai_total', (select count(*) from mine where from_ai),
      'ai_limit', public.ai_words_limit(),
      'items', coalesce((select json_agg(row_to_json(p)) from picked p), '[]'::json)
    )
  );
end;
$$;

revoke all on function public.ai_words_state(), public.add_ai_words(jsonb, text), public.undo_ai_words(text[]) from public, anon;
grant execute on function public.ai_words_state(), public.add_ai_words(jsonb, text), public.undo_ai_words(text[]) to authenticated;

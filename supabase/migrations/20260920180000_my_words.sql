-- «Мои слова»: words saved from the tap-a-word translation, trained with cards.
-- The repetition dates work like the topic queue: 1, 3, 7, 14, 30 days.
create table public.my_words (
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null check (char_length(word) between 1 and 60),
  ru text not null check (char_length(ru) between 1 and 200),
  streak int not null default 0,
  due_at timestamptz not null default now(),
  added_at timestamptz not null default now(),
  primary key (user_id, word)
);
alter table public.my_words enable row level security;
create index my_words_due on public.my_words (user_id, due_at);

create or replace function public.add_word(p_word text, p_ru text)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_word text := nullif(btrim(lower(coalesce(p_word, ''))), '');
  v_ru text := nullif(btrim(coalesce(p_ru, '')), '');
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if v_word is null or v_ru is null or char_length(v_word) > 60 or char_length(v_ru) > 200 then
    raise exception 'bad word' using errcode = '22023';
  end if;
  if (select count(*) from my_words where user_id = v_me) >= 500 then
    raise exception 'too many words' using errcode = '54000';
  end if;
  insert into my_words (user_id, word, ru) values (v_me, v_word, v_ru)
  on conflict (user_id, word) do update set ru = excluded.ru;
end;
$$;

create or replace function public.remove_word(p_word text)
returns void
language sql
volatile
security definer
set search_path = public
as $$
  delete from my_words where user_id = (select auth.uid()) and word = btrim(lower(coalesce(p_word, '')));
$$;

-- p_due_only: only the words whose time has come (for a training round).
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
      select word, ru, streak, due_at, added_at from mine
      where not p_due_only or due_at <= now()
      order by case when p_due_only then due_at else added_at end desc
      limit v_limit offset v_offset
    )
    select json_build_object(
      'total', (select count(*) from mine),
      'due', (select count(*) from mine where due_at <= now()),
      'items', coalesce((select json_agg(row_to_json(p)) from picked p), '[]'::json)
    )
  );
end;
$$;

-- One card answered: «знаю» pushes the next showing further away, «не знаю» brings it back to a day.
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
  set streak = v_streak, due_at = now() + (public._review_gap(v_streak) || ' days')::interval
  where user_id = v_me and word = v_word;
end;
$$;

revoke all on function public.add_word(text, text), public.remove_word(text),
  public.list_my_words(boolean, int, int), public.word_result(text, boolean) from public, anon;
grant execute on function public.add_word(text, text), public.remove_word(text),
  public.list_my_words(boolean, int, int), public.word_result(text, boolean) to authenticated;

-- «Удалить все слова» on the «Мои слова» screen: clears the caller's own dictionary in one call.
create or replace function public.remove_all_words()
returns int
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_count int;
begin
  if v_me is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  delete from my_words where user_id = v_me;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.remove_all_words() from public, anon;
grant execute on function public.remove_all_words() to authenticated;

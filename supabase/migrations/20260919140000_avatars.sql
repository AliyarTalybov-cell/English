-- Profile photos live in the public bucket "Photo" as <user id>/avatar.jpg.
-- The bucket is public, so photos open by URL without a policy; the API (listing, upsert)
-- sees and changes only the user's own folder.
update storage.buckets
set file_size_limit = 2097152, allowed_mime_types = array['image/jpeg']
where id = 'Photo';

create policy "avatar read own" on storage.objects for select to authenticated
  using (bucket_id = 'Photo' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'Photo' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar update own" on storage.objects for update to authenticated
  using (bucket_id = 'Photo' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'Photo' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'Photo' and (storage.foldername(name))[1] = auth.uid()::text);

-- Bucket: menu-images (public) + RLS for menu item photos
-- Apply this in Supabase Dashboard > SQL Editor.

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Public read
create policy "menu_images_public_read"
  on storage.objects for select
  using (bucket_id = 'menu-images');

-- Authenticated users can upload (needed for admin uploads via the app / REST with user token)
create policy "menu_images_auth_insert"
  on storage.objects for insert
  with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');

create policy "menu_images_auth_update"
  on storage.objects for update
  using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

create policy "menu_images_auth_delete"
  on storage.objects for delete
  using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

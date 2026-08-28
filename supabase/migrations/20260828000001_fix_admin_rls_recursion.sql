-- Fix: infinite recursion detected in policy for relation "admin_users"
--
-- Root cause: every admin-write policy used an inline subquery
--   EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid())
-- which itself is governed by the RLS policy on admin_users, and one of those
-- policies (admin_users_superadmin_write) references admin_users again,
-- producing an infinite recursion (Postgres error 42P17).
--
-- Fix: use the existing SECURITY DEFINER helper functions (is_admin,
-- is_superadmin). SECURITY DEFINER bypasses RLS, so no recursion occurs.

-- Recreate admin_users policies using SECURITY DEFINER helpers first,
-- so the rows are visible during evaluation.
DROP POLICY IF EXISTS "admin_users_self_read" ON admin_users;
DROP POLICY IF EXISTS "admin_users_superadmin_write" ON admin_users;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;
DROP POLICY IF EXISTS "menu_items_admin_write" ON menu_items;
DROP POLICY IF EXISTS "gallery_admin_write" ON gallery;
DROP POLICY IF EXISTS "posts_admin_write" ON posts;
DROP POLICY IF EXISTS "testimonials_admin_write" ON testimonials;
DROP POLICY IF EXISTS "reservations_admin_read" ON reservations;
DROP POLICY IF EXISTS "reservations_admin_write" ON reservations;
DROP POLICY IF EXISTS "contact_messages_admin_read" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_write" ON contact_messages;
DROP POLICY IF EXISTS "settings_admin_write" ON settings;

-- admin_users: self read, superadmin write (via SECURITY DEFINER helper)
CREATE POLICY "admin_users_self_read" ON admin_users
  FOR SELECT USING (auth_uid = auth.uid());
CREATE POLICY "admin_users_superadmin_write" ON admin_users
  FOR ALL USING (is_superadmin());

-- Recreate all other admin policies using the SECURITY DEFINER helpers.
CREATE POLICY "categories_admin_write" ON categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "menu_items_admin_write" ON menu_items
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "gallery_admin_write" ON gallery
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "posts_admin_write" ON posts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "testimonials_admin_write" ON testimonials
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "reservations_admin_read" ON reservations
  FOR SELECT USING (is_admin());
CREATE POLICY "reservations_admin_write" ON reservations
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "contact_messages_admin_read" ON contact_messages
  FOR SELECT USING (is_admin());
CREATE POLICY "contact_messages_admin_write" ON contact_messages
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "settings_admin_write" ON settings
  FOR ALL USING (is_superadmin()) WITH CHECK (is_superadmin());

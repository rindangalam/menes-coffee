-- Menes Coffee & Eatery - Supabase Database Schema & RLS
-- Run this in Supabase Dashboard > SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: menu_items
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: reservations
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  guest_count int NOT NULL CHECK (guest_count > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: gallery
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url text NOT NULL,
  caption text,
  category text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: posts
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  image_url text,
  type text DEFAULT 'article' CHECK (type IN ('article', 'promo')),
  valid_from timestamptz,
  valid_until timestamptz,
  published_at timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: contact_messages
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: settings
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('business_name', '"Menes Coffee & Eatery"'),
  ('address', '"Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat"'),
  ('phone', '""'),
  ('email', '""'),
  ('instagram', '"https://instagram.com/menescoffee"'),
  ('tiktok', '"https://tiktok.com/@menescoffee"'),
  ('google_maps', '"https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z"'),
  ('opening_hours', '{"monday": {"open": "08:00", "close": "04:00", "closed": false}, "tuesday": {"open": "08:00", "close": "04:00", "closed": false}, "wednesday": {"open": "08:00", "close": "04:00", "closed": false}, "thursday": {"open": "08:00", "close": "04:00", "closed": false}, "friday": {"open": "08:00", "close": "04:00", "closed": false}, "saturday": {"open": "08:00", "close": "04:00", "closed": false}, "sunday": {"open": "08:00", "close": "04:00", "closed": false}}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- TABLE: admin_users
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text DEFAULT 'staff' CHECK (role IN ('superadmin', 'staff')),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_posts_status_type ON posts(status, type);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- categories: public read, admin write
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- menu_items: public read available, admin write
CREATE POLICY "menu_items_public_read" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "menu_items_admin_write" ON menu_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- gallery: public read, admin write
CREATE POLICY "gallery_public_read" ON gallery FOR SELECT USING (true);
CREATE POLICY "gallery_admin_write" ON gallery FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- posts: public read published only, admin write
CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "posts_admin_write" ON posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- testimonials: public read approved only, public insert (forced pending), admin write
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (status = 'approved');
CREATE POLICY "testimonials_public_insert" ON testimonials FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "testimonials_admin_write" ON testimonials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- reservations: public insert only, admin read/write
CREATE POLICY "reservations_public_insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_admin_read" ON reservations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);
CREATE POLICY "reservations_admin_write" ON reservations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- contact_messages: public insert only, admin read/write
CREATE POLICY "contact_messages_public_insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_admin_read" ON contact_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);
CREATE POLICY "contact_messages_admin_write" ON contact_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  )
);

-- settings: public read, admin write (superadmin only ideally)
CREATE POLICY "settings_public_read" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid() AND role = 'superadmin'
  )
);

-- admin_users: self read, superadmin write
CREATE POLICY "admin_users_self_read" ON admin_users FOR SELECT USING (auth_uid = auth.uid());
CREATE POLICY "admin_users_superadmin_write" ON admin_users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid() AND role = 'superadmin'
  )
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()
  );
$$;

-- Function to check if user is superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE auth_uid = auth.uid() AND role = 'superadmin'
  );
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at trigger for menu_items
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Updated_at trigger for settings
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Force testimonials status to pending on public insert
CREATE OR REPLACE FUNCTION force_testimonial_pending()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.status = 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS force_testimonial_pending_trigger ON testimonials;
CREATE TRIGGER force_testimonial_pending_trigger
  BEFORE INSERT ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION force_testimonial_pending();

-- ============================================
-- STORAGE BUCKETS (run separately in Storage section)
-- ============================================
-- bucket: menu-images (public read, admin write)
-- bucket: gallery-images (public read, admin write)

-- Storage policies for menu-images:
-- CREATE POLICY "menu_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
-- CREATE POLICY "menu_images_admin_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()));
-- CREATE POLICY "menu_images_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()));
-- CREATE POLICY "menu_images_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()));

-- Storage policies for gallery-images:
-- CREATE POLICY "gallery_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
-- CREATE POLICY "gallery_images_admin_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()));
-- CREATE POLICY "gallery_images_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()));
-- CREATE POLICY "gallery_images_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_uid = auth.uid()));
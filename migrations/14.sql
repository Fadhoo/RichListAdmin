
CREATE TABLE venue_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venue_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price REAL,
  currency TEXT DEFAULT 'NGN',
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT 1,
  is_featured BOOLEAN DEFAULT 0,
  minimum_order INTEGER DEFAULT 1,
  serving_size TEXT,
  alcohol_content REAL,
  flavor_profile TEXT,
  brand TEXT,
  origin_country TEXT,
  preparation_time_minutes INTEGER,
  ingredients TEXT,
  dietary_restrictions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venue_products_venue_id ON venue_products(venue_id);
CREATE INDEX idx_venue_products_category ON venue_products(category);
CREATE INDEX idx_venue_products_available ON venue_products(is_available);

CREATE TABLE venue_product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  color_code TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default product categories for Lagos clubs
INSERT INTO venue_product_categories (name, display_name, description, icon_name, color_code, sort_order) VALUES
('alcoholic_beverages', 'Alcoholic Beverages', 'Beer, wine, spirits, cocktails and other alcoholic drinks', 'Wine', '#8B5CF6', 1),
('non_alcoholic_beverages', 'Non-Alcoholic Beverages', 'Soft drinks, juices, energy drinks, water', 'Coffee', '#10B981', 2),
('shisha', 'Shisha & Hookah', 'Shisha flavors, hookah pipes and accessories', 'Cigarette', '#F59E0B', 3),
('cocktails', 'Signature Cocktails', 'House special cocktails and mixed drinks', 'GlassWater', '#EC4899', 4),
('food', 'Food & Snacks', 'Small chops, finger foods, appetizers', 'UtensilsCrossed', '#EF4444', 5),
('bottle_service', 'Bottle Service', 'Premium bottle service packages', 'Sparkles', '#6366F1', 6),
('vip_packages', 'VIP Packages', 'VIP table packages and exclusive experiences', 'Crown', '#F97316', 7),
('entertainment', 'Entertainment', 'Live shows, DJ services, performances', 'Music', '#84CC16', 8);

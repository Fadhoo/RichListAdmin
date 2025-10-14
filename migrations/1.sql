
CREATE TABLE venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  capacity INTEGER,
  is_verified BOOLEAN DEFAULT 0,
  owner_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  venue_id INTEGER NOT NULL,
  promoter_id TEXT,
  event_date DATETIME NOT NULL,
  start_time TEXT,
  end_time TEXT,
  base_price REAL,
  max_capacity INTEGER,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  is_house_party BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  guest_count INTEGER DEFAULT 1,
  total_amount REAL,
  booking_status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'pending',
  booking_reference TEXT,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  permissions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venues_owner_id ON venues(owner_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_promoter_id ON events(promoter_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);

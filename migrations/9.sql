
-- Concierge staff table
CREATE TABLE concierge_staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  position TEXT DEFAULT 'concierge',
  specialties TEXT,
  hourly_rate REAL,
  availability_schedule TEXT,
  is_active BOOLEAN DEFAULT 1,
  venue_id INTEGER,
  profile_image TEXT,
  languages TEXT,
  experience_years INTEGER,
  rating REAL DEFAULT 0,
  total_requests INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Concierge services table
CREATE TABLE concierge_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price REAL,
  price_type TEXT DEFAULT 'fixed',
  duration_minutes INTEGER,
  is_available BOOLEAN DEFAULT 1,
  venue_id INTEGER,
  requirements TEXT,
  max_capacity INTEGER,
  advance_booking_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Concierge requests table
CREATE TABLE concierge_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  concierge_id INTEGER,
  service_id INTEGER,
  venue_id INTEGER,
  event_id INTEGER,
  request_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  preferred_date DATETIME,
  preferred_time TEXT,
  guest_count INTEGER DEFAULT 1,
  budget_range TEXT,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  assigned_at DATETIME,
  completed_at DATETIME,
  total_cost REAL,
  payment_status TEXT DEFAULT 'pending',
  customer_rating INTEGER,
  customer_feedback TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_concierge_staff_venue ON concierge_staff(venue_id);
CREATE INDEX idx_concierge_staff_active ON concierge_staff(is_active);
CREATE INDEX idx_concierge_services_venue ON concierge_services(venue_id);
CREATE INDEX idx_concierge_services_category ON concierge_services(category);
CREATE INDEX idx_concierge_requests_user ON concierge_requests(user_id);
CREATE INDEX idx_concierge_requests_concierge ON concierge_requests(concierge_id);
CREATE INDEX idx_concierge_requests_status ON concierge_requests(status);
CREATE INDEX idx_concierge_requests_date ON concierge_requests(preferred_date);

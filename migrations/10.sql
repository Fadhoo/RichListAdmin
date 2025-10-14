
-- Create concierge service providers table
CREATE TABLE concierge_service_providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  website_url TEXT,
  logo_url TEXT,
  business_license TEXT,
  is_verified BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  rating REAL DEFAULT 0,
  total_requests INTEGER DEFAULT 0,
  commission_rate REAL DEFAULT 10.0,
  payment_terms TEXT DEFAULT 'net_30',
  specialties TEXT,
  languages TEXT,
  operating_hours TEXT,
  venue_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add provider_id to existing tables
ALTER TABLE concierge_staff ADD COLUMN provider_id INTEGER;
ALTER TABLE concierge_services ADD COLUMN provider_id INTEGER;
ALTER TABLE concierge_requests ADD COLUMN provider_id INTEGER;

-- Create indexes for better performance
CREATE INDEX idx_concierge_staff_provider_id ON concierge_staff(provider_id);
CREATE INDEX idx_concierge_services_provider_id ON concierge_services(provider_id);
CREATE INDEX idx_concierge_requests_provider_id ON concierge_requests(provider_id);
CREATE INDEX idx_concierge_service_providers_active ON concierge_service_providers(is_active);
CREATE INDEX idx_concierge_service_providers_verified ON concierge_service_providers(is_verified);


-- Create users table first
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  google_user_data TEXT,
  is_active BOOLEAN DEFAULT 1,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users for demo purposes
INSERT INTO users (id, email, google_user_data, is_active, created_at, last_login) VALUES 
('user_001', 'john.doe@example.com', '{"name": "John Doe", "picture": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", "email": "john.doe@example.com"}', 1, '2024-01-15 10:30:00', '2024-01-20 14:22:00'),
('user_002', 'sarah.smith@example.com', '{"name": "Sarah Smith", "picture": "https://images.unsplash.com/photo-1494790108755-2616b612b2ab?w=150&h=150&fit=crop&crop=face", "email": "sarah.smith@example.com"}', 1, '2024-01-10 09:15:00', '2024-01-19 16:45:00'),
('user_003', 'mike.johnson@example.com', '{"name": "Mike Johnson", "picture": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", "email": "mike.johnson@example.com"}', 1, '2024-01-05 14:20:00', '2024-01-18 12:30:00'),
('user_004', 'emma.wilson@example.com', '{"name": "Emma Wilson", "picture": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", "email": "emma.wilson@example.com"}', 0, '2024-01-01 08:45:00', '2024-01-15 11:20:00');

-- Insert sample subscriptions
INSERT INTO user_subscriptions (user_id, plan_type, status, started_at, expires_at, billing_cycle, price_paid, payment_method) VALUES
('user_001', 'premium', 'active', '2024-01-15 10:30:00', '2024-02-15 10:30:00', 'monthly', 29.99, 'credit_card'),
('user_002', 'pro', 'active', '2024-01-10 09:15:00', '2024-04-10 09:15:00', 'quarterly', 75.00, 'credit_card'),
('user_003', 'free', 'active', '2024-01-05 14:20:00', NULL, NULL, 0, NULL);

-- Insert sample user activities
INSERT INTO user_activities (user_id, activity_type, description, metadata) VALUES
('user_001', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.100", "device": "desktop"}'),
('user_001', 'booking_created', 'Created booking for event "Friday Night Vibes"', '{"booking_id": "BK001", "amount": 120.00}'),
('user_001', 'payment_completed', 'Payment completed for booking', '{"booking_id": "BK001", "method": "credit_card"}'),
('user_002', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.101", "device": "mobile"}'),
('user_002', 'subscription_upgraded', 'Upgraded to Pro plan', '{"from": "free", "to": "pro", "amount": 75.00}'),
('user_002', 'booking_created', 'Created booking for event', '{"booking_id": "BK002", "amount": 240.00}'),
('user_003', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.102", "device": "tablet"}'),
('user_003', 'booking_created', 'Created booking for event', '{"booking_id": "BK004", "amount": 135.00}'),
('user_004', 'account_deactivated', 'Account deactivated due to policy violation', '{"reason": "spam", "admin": "admin@clubhub.com"}');

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);


-- Add more comprehensive user data for testing
INSERT INTO users (id, email, google_user_data, is_active, last_login, created_at, updated_at) VALUES 
('user_005', 'alex.chen@example.com', '{"name": "Alex Chen", "picture": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", "email": "alex.chen@example.com"}', 1, '2024-01-22 10:15:00', '2024-01-12 16:30:00', '2024-01-22 10:15:00'),
('user_006', 'maria.garcia@example.com', '{"name": "Maria Garcia", "picture": "https://images.unsplash.com/photo-1494790108755-2616b612b2ab?w=150&h=150&fit=crop&crop=face", "email": "maria.garcia@example.com"}', 1, '2024-01-21 14:45:00', '2024-01-08 11:20:00', '2024-01-21 14:45:00'),
('user_007', 'david.lee@example.com', '{"name": "David Lee", "picture": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", "email": "david.lee@example.com"}', 0, '2024-01-10 09:30:00', '2024-01-03 08:15:00', '2024-01-18 12:00:00'),
('user_008', 'lisa.anderson@example.com', '{"name": "Lisa Anderson", "picture": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", "email": "lisa.anderson@example.com"}', 1, '2024-01-23 16:20:00', '2024-01-14 13:45:00', '2024-01-23 16:20:00'),
('user_009', 'robert.taylor@example.com', '{"name": "Robert Taylor", "picture": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", "email": "robert.taylor@example.com"}', 1, '2024-01-20 11:30:00', '2024-01-06 09:20:00', '2024-01-20 11:30:00'),
('user_010', 'jessica.brown@example.com', '{"name": "Jessica Brown", "picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", "email": "jessica.brown@example.com"}', 1, '2024-01-24 08:45:00', '2024-01-16 15:10:00', '2024-01-24 08:45:00'),
('user_011', 'michael.wilson@example.com', '{"name": "Michael Wilson", "picture": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", "email": "michael.wilson@example.com"}', 0, '2024-01-12 12:15:00', '2024-01-02 10:30:00', '2024-01-19 14:20:00'),
('user_012', 'olivia.davis@example.com', '{"name": "Olivia Davis", "picture": "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face", "email": "olivia.davis@example.com"}', 1, '2024-01-25 17:30:00', '2024-01-18 12:40:00', '2024-01-25 17:30:00');

-- Add more user subscriptions
INSERT INTO user_subscriptions (user_id, plan_type, status, started_at, expires_at, billing_cycle, price_paid, payment_method, created_at, updated_at) VALUES
('user_004', 'pro', 'active', '2024-01-01 08:45:00', '2024-02-01 08:45:00', 'monthly', 25.00, 'credit_card', '2024-01-01 08:45:00', '2024-01-01 08:45:00'),
('user_005', 'premium', 'active', '2024-01-12 16:30:00', '2024-02-12 16:30:00', 'monthly', 50.00, 'credit_card', '2024-01-12 16:30:00', '2024-01-12 16:30:00'),
('user_008', 'pro', 'active', '2024-01-14 13:45:00', '2024-04-14 13:45:00', 'quarterly', 75.00, 'paypal', '2024-01-14 13:45:00', '2024-01-14 13:45:00'),
('user_010', 'premium', 'active', '2024-01-16 15:10:00', '2025-01-16 15:10:00', 'yearly', 600.00, 'credit_card', '2024-01-16 15:10:00', '2024-01-16 15:10:00'),
('user_012', 'pro', 'cancelled', '2024-01-18 12:40:00', '2024-02-18 12:40:00', 'monthly', 25.00, 'credit_card', '2024-01-18 12:40:00', '2024-01-25 09:15:00');

-- Add more diverse user activities
INSERT INTO user_activities (user_id, activity_type, description, metadata, created_at) VALUES
-- User 005 activities
('user_005', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.105", "device": "desktop"}', '2024-01-22 10:15:00'),
('user_005', 'subscription_upgraded', 'Upgraded to Premium plan', '{"from": "free", "to": "premium", "amount": 50.00}', '2024-01-12 16:35:00'),
('user_005', 'booking_created', 'Created booking for event "Jazz Night at Rooftop"', '{"booking_id": "BK020", "amount": 85.00}', '2024-01-15 19:20:00'),
('user_005', 'payment_completed', 'Payment completed for booking', '{"booking_id": "BK020", "method": "credit_card"}', '2024-01-15 19:21:00'),

-- User 006 activities  
('user_006', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.106", "device": "mobile"}', '2024-01-21 14:45:00'),
('user_006', 'profile_updated', 'Updated profile information', '{"fields": ["phone", "preferences"]}', '2024-01-21 15:00:00'),
('user_006', 'booking_created', 'Created booking for event "Wedding Reception"', '{"booking_id": "BK025", "amount": 250.00}', '2024-01-20 11:30:00'),
('user_006', 'event_created', 'Created new house party event', '{"event_id": 12, "title": "Birthday Celebration"}', '2024-01-19 16:45:00'),

-- User 007 activities (inactive user)
('user_007', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.107", "device": "desktop"}', '2024-01-10 09:30:00'),
('user_007', 'status_change', 'Account deactivated by admin admin@clubhub.com', '{}', '2024-01-18 12:00:00'),
('user_007', 'booking_cancelled', 'Cancelled booking for event "New Year Gala"', '{"booking_id": "BK005", "refund_amount": 150.00}', '2024-01-11 14:20:00'),

-- User 008 activities
('user_008', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.108", "device": "tablet"}', '2024-01-23 16:20:00'),
('user_008', 'subscription_upgraded', 'Upgraded to Pro plan (quarterly)', '{"from": "free", "to": "pro", "amount": 75.00}', '2024-01-14 13:50:00'),
('user_008', 'booking_created', 'Created booking for event "Tech Product Launch"', '{"booking_id": "BK030", "amount": 120.00}', '2024-01-22 10:15:00'),
('user_008', 'payment_completed', 'Payment completed for booking', '{"booking_id": "BK030", "method": "paypal"}', '2024-01-22 10:16:00'),

-- User 009 activities
('user_009', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.109", "device": "desktop"}', '2024-01-20 11:30:00'),
('user_009', 'booking_created', 'Created booking for event "Corporate Mixer"', '{"booking_id": "BK018", "amount": 75.00}', '2024-01-18 14:30:00'),
('user_009', 'payment_pending', 'Payment pending for booking', '{"booking_id": "BK018", "method": "bank_transfer"}', '2024-01-18 14:32:00'),

-- User 010 activities
('user_010', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.110", "device": "mobile"}', '2024-01-24 08:45:00'),
('user_010', 'subscription_upgraded', 'Upgraded to Premium plan (yearly)', '{"from": "free", "to": "premium", "amount": 600.00}', '2024-01-16 15:15:00'),
('user_010', 'booking_created', 'Created booking for event "Charity Gala"', '{"booking_id": "BK035", "amount": 300.00}', '2024-01-23 20:15:00'),
('user_010', 'payment_completed', 'Payment completed for booking', '{"booking_id": "BK035", "method": "credit_card"}', '2024-01-23 20:16:00'),
('user_010', 'event_created', 'Created VIP corporate event', '{"event_id": 15, "title": "Executive Networking Night"}', '2024-01-21 09:30:00'),

-- User 011 activities (inactive user)
('user_011', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.111", "device": "desktop"}', '2024-01-12 12:15:00'),
('user_011', 'status_change', 'Account deactivated for policy violation', '{}', '2024-01-19 14:20:00'),
('user_011', 'booking_created', 'Created booking for event "Underground Party"', '{"booking_id": "BK008", "amount": 45.00}', '2024-01-10 22:30:00'),

-- User 012 activities
('user_012', 'login', 'User logged in via Google OAuth', '{"ip": "192.168.1.112", "device": "mobile"}', '2024-01-25 17:30:00'),
('user_012', 'subscription_cancelled', 'Cancelled Pro subscription', '{"reason": "moving", "refund_amount": 12.50}', '2024-01-25 09:15:00'),
('user_012', 'booking_created', 'Created booking for event "Farewell Party"', '{"booking_id": "BK040", "amount": 60.00}', '2024-01-24 18:45:00'),
('user_012', 'payment_completed', 'Payment completed for booking', '{"booking_id": "BK040", "method": "credit_card"}', '2024-01-24 18:46:00');


-- Insert some sample bookings to make the dashboard more realistic
INSERT INTO bookings (event_id, user_id, guest_count, total_amount, booking_status, payment_status, booking_reference, special_requests)
VALUES 
(2, 'user789', 6, 180.0, 'confirmed', 'completed', 'BK001236', 'VIP table request'),
(3, 'user101', 3, 75.0, 'pending', 'pending', 'BK001237', null),
(1, 'user202', 8, 200.0, 'confirmed', 'completed', 'BK001238', 'Birthday celebration'),
(2, 'user303', 1, 30.0, 'cancelled', 'refunded', 'BK001239', null);

-- Add more recent sample venues
INSERT INTO venues (name, description, address, city, phone, email, image_url, capacity, is_verified, owner_id)
VALUES 
('Rooftop Vibes', 'Open-air rooftop venue with city skyline views', '789 Sky Blvd', 'New York', '(555) 246-8100', 'events@rooftopvibes.com', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 300, 1, 'default-admin'),
('Electric Warehouse', 'Industrial warehouse converted to electronic music venue', '321 Factory Rd', 'Chicago', '(555) 369-2580', 'info@electricwarehouse.com', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 800, 1, 'default-admin');

-- Add more sample events
INSERT INTO events (title, description, venue_id, promoter_id, event_date, start_time, end_time, base_price, max_capacity, image_url, status, is_house_party)
VALUES 
('Rooftop Sunset Sessions', 'Chill house music with breathtaking sunset views', 4, 'default-admin', '2024-12-20', '18:00', '02:00', 35.0, 250, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'approved', 0),
('Warehouse Rave', 'All-night electronic music experience', 5, 'default-admin', '2024-12-22', '23:00', '08:00', 45.0, 700, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'pending', 0),
('VIP Private Party', 'Exclusive house party for select guests', 1, 'default-admin', '2024-12-25', '21:00', '03:00', 75.0, 50, null, 'pending', 1);

-- Update existing venues with better image URLs
UPDATE venues SET image_url = 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' WHERE id = 1;
UPDATE venues SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' WHERE id = 2;

-- Update existing events with better image URLs  
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' WHERE id = 1;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' WHERE id = 2;

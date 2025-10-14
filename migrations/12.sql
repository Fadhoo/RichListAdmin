
-- Insert sample concierge requests
INSERT INTO concierge_requests (user_id, provider_id, concierge_id, service_id, request_type, title, description, preferred_date, preferred_time, guest_count, budget_range, special_requirements, status, priority, assigned_at, total_cost, payment_status, customer_rating, customer_feedback, internal_notes) VALUES
-- Completed requests
('user_001', 1, 1, 1, 'vip_table', 'VIP Table for Birthday Celebration', 'Need premium table for my birthday party at Quilox. Expecting 6 guests, want bottle service included.', '2024-10-05 22:00:00', '10:00 PM', 6, '₦400,000 - ₦600,000', 'Birthday cake arrangement, champagne preference: Dom Pérignon', 'completed', 'high', '2024-10-03 14:30:00', 550000, 'paid', 5, 'Exceptional service! Adebayo went above and beyond to make the night special.', 'VIP customer - priority handling'),

('user_002', 2, 4, 8, 'entertainment', 'Exclusive Access to Burna Boy Concert', 'Want VIP access and backstage pass for Burna Boy concert at Eko Atlantic', '2024-09-28 20:00:00', '8:00 PM', 2, '₦500,000 - ₦800,000', 'Photo opportunity with artist, VIP lounge access', 'completed', 'urgent', '2024-09-20 11:15:00', 750000, 'paid', 5, 'Amazing experience! Got to meet Burna Boy and had premium viewing area.', 'Celebrity coordination successful'),

('user_003', 3, 6, 9, 'wellness', 'Couples Spa Day', 'Anniversary spa treatment for me and my wife at Four Points Spa', '2024-10-01 10:00:00', '10:00 AM', 2, '₦150,000 - ₦200,000', 'Couples massage, champagne service, rose petals', 'completed', 'normal', '2024-09-28 16:20:00', 185000, 'paid', 4, 'Very relaxing experience, staff was professional', 'Regular customer - good relationship'),

-- In progress requests
('user_004', 1, 2, 4, 'dining', 'Fine Dining Experience', 'Anniversary dinner at Nok by Alara, need romantic table setup', '2024-10-15 19:30:00', '7:30 PM', 2, '₦100,000 - ₦200,000', 'Window table, live music, flower arrangement', 'in_progress', 'high', '2024-10-12 09:45:00', 175000, 'pending', NULL, NULL, 'Restaurant confirmed, flowers ordered'),

('user_005', 2, 5, 7, 'lifestyle', 'Personal Shopping for Gala', 'Need complete outfit selection for charity gala next week', '2024-10-16 14:00:00', '2:00 PM', 1, '₦200,000 - ₦500,000', 'Formal black-tie attire, shoes, accessories', 'in_progress', 'normal', '2024-10-11 13:20:00', NULL, 'pending', NULL, NULL, 'Scheduled appointment at Temple Muse'),

-- Assigned requests
('user_006', 1, 3, 3, 'transport', 'Airport Transfer Service', 'Luxury pickup from Murtala Mohammed Airport for business delegation', '2024-10-18 16:00:00', '4:00 PM', 4, '₦50,000 - ₦100,000', 'Mercedes S-Class or similar, bottled water, newspapers', 'assigned', 'normal', '2024-10-13 10:30:00', 85000, 'pending', NULL, NULL, 'Flight details confirmed, vehicle reserved'),

('user_007', 3, 7, 11, 'recreation', 'Golf Day Package', 'Golf outing for business clients at Ikoyi Golf Club', '2024-10-20 08:00:00', '8:00 AM', 4, '₦80,000 - ₦150,000', 'Equipment rental, caddy service, lunch reservation', 'assigned', 'normal', '2024-10-12 15:45:00', 135000, 'pending', NULL, NULL, 'Tee time booked, equipment confirmed'),

-- Pending requests
('user_008', 4, NULL, NULL, 'business', 'Government Meeting Facilitation', 'Need protocol assistance for meeting with FCT Minister', '2024-10-25 10:00:00', '10:00 AM', 3, '₦100,000 - ₦300,000', 'Security clearance assistance, official documentation', 'pending', 'urgent', NULL, NULL, 'pending', NULL, NULL, 'Requires security verification'),

('user_009', 5, NULL, 15, 'entertainment', 'Private Housewarming Party', 'Complete party planning for new house in Banana Island', '2024-10-22 18:00:00', '6:00 PM', 30, '₦200,000 - ₦500,000', 'Catering, decoration, entertainment, security', 'pending', 'high', NULL, NULL, 'pending', NULL, NULL, 'Large scale event - multiple vendors needed'),

('user_010', 2, NULL, 6, 'entertainment', 'Yacht Party for Corporate Event', 'Company retreat yacht charter for weekend', '2024-10-26 12:00:00', '12:00 PM', 20, '₦800,000 - ₦1,500,000', 'Catering, music system, team building activities', 'pending', 'normal', NULL, NULL, 'pending', NULL, NULL, 'Corporate client - invoice required'),

-- Cancelled request
('user_011', 1, NULL, 2, 'entertainment', 'Celebrity Appearance', 'Want Davido appearance at private party', '2024-10-19 21:00:00', '9:00 PM', 50, '₦2,000,000 - ₦5,000,000', 'Performance, photos, merchandise', 'cancelled', 'urgent', NULL, NULL, 'refunded', NULL, NULL, 'Artist schedule conflict - full refund processed');

-- Update provider ratings and total requests based on completed requests
UPDATE concierge_service_providers SET 
    rating = 4.8, 
    total_requests = 4 
WHERE id = 1;

UPDATE concierge_service_providers SET 
    rating = 4.6, 
    total_requests = 3 
WHERE id = 2;

UPDATE concierge_service_providers SET 
    rating = 4.5, 
    total_requests = 2 
WHERE id = 3;

UPDATE concierge_service_providers SET 
    rating = 0, 
    total_requests = 1 
WHERE id = 4;

UPDATE concierge_service_providers SET 
    rating = 0, 
    total_requests = 1 
WHERE id = 5;

-- Update staff ratings and total requests
UPDATE concierge_staff SET 
    rating = 4.9, 
    total_requests = 1 
WHERE id = 1;

UPDATE concierge_staff SET 
    rating = 4.7, 
    total_requests = 1 
WHERE id = 2;

UPDATE concierge_staff SET 
    rating = 4.5, 
    total_requests = 1 
WHERE id = 3;

UPDATE concierge_staff SET 
    rating = 4.8, 
    total_requests = 2 
WHERE id = 4;

UPDATE concierge_staff SET 
    rating = 4.4, 
    total_requests = 1 
WHERE id = 5;

UPDATE concierge_staff SET 
    rating = 4.6, 
    total_requests = 1 
WHERE id = 6;

UPDATE concierge_staff SET 
    rating = 4.3, 
    total_requests = 1 
WHERE id = 7;


-- Add sample venues if none exist
INSERT OR IGNORE INTO venues (id, name, description, address, city, phone, email, image_url, capacity, is_verified, owner_id) VALUES
(1, 'The Grand Ballroom', 'Elegant venue perfect for formal events and celebrations', '123 Main Street', 'New York', '+1-555-0101', 'info@grandballroom.com', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 200, 1, 'user_001'),
(2, 'Rooftop Lounge', 'Modern rooftop venue with city skyline views', '456 High Street', 'Los Angeles', '+1-555-0102', 'bookings@rooftopla.com', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', 150, 1, 'user_002'),
(3, 'Garden Pavilion', 'Outdoor venue surrounded by beautiful gardens', '789 Garden Ave', 'Miami', '+1-555-0103', 'events@gardenpav.com', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 100, 1, 'user_003'),
(4, 'Industrial Warehouse', 'Converted warehouse space for unique events', '321 Industrial Blvd', 'Chicago', '+1-555-0104', 'hello@warehouse.com', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 300, 1, 'user_004'),
(5, 'Lakeside Manor', 'Elegant lakeside venue for intimate gatherings', '654 Lake Drive', 'Seattle', '+1-555-0105', 'info@lakesidemanor.com', 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800', 80, 1, 'user_005');

-- Add sample events if none exist
INSERT OR IGNORE INTO events (id, title, description, venue_id, promoter_id, event_date, start_time, end_time, base_price, max_capacity, image_url, status, is_house_party) VALUES
(1, 'New Year Gala 2024', 'Elegant New Year celebration with live music and gourmet dining', 1, 'user_001', '2024-12-31', '19:00', '02:00', 150.00, 180, 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800', 'approved', 0),
(2, 'Sunset Jazz Night', 'Intimate jazz performance with city views', 2, 'user_002', '2024-11-15', '18:00', '23:00', 75.00, 120, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'approved', 0),
(3, 'Garden Wedding Reception', 'Beautiful outdoor wedding celebration', 3, 'user_003', '2024-10-20', '16:00', '22:00', 200.00, 85, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'approved', 0),
(4, 'Tech Startup Launch', 'Product launch event for innovative startup', 4, 'user_004', '2024-11-08', '18:30', '22:00', 50.00, 250, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'approved', 0),
(5, 'Charity Fundraiser Gala', 'Annual fundraising event for local charities', 1, 'user_005', '2024-12-15', '19:00', '23:30', 125.00, 200, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'approved', 0),
(6, 'House Party Celebration', 'Intimate birthday celebration', 5, 'user_006', '2024-10-25', '19:00', '01:00', 45.00, 60, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'pending', 1),
(7, 'Corporate Holiday Party', 'End-of-year celebration for employees', 2, 'user_007', '2024-12-20', '17:00', '23:00', 85.00, 140, 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800', 'approved', 0),
(8, 'Art Gallery Opening', 'Exclusive art exhibition opening night', 4, 'user_008', '2024-11-12', '18:00', '21:00', 35.00, 100, 'https://images.unsplash.com/photo-1544967882-6abaa4d532d6?w=800', 'approved', 0);

-- Add diverse sample bookings
INSERT OR IGNORE INTO bookings (id, event_id, user_id, guest_count, total_amount, booking_status, payment_status, booking_reference, special_requests) VALUES
-- New Year Gala bookings
(1, 1, 'user_101', 2, 300.00, 'confirmed', 'completed', 'BK001-2024', 'Table near the stage please'),
(2, 1, 'user_102', 4, 600.00, 'confirmed', 'completed', 'BK002-2024', 'Dietary restrictions: vegetarian meals for 2 guests'),
(3, 1, 'user_103', 1, 150.00, 'confirmed', 'pending', 'BK003-2024', NULL),
(4, 1, 'user_104', 3, 450.00, 'pending', 'pending', 'BK004-2024', 'Anniversary celebration - need cake table'),

-- Sunset Jazz Night bookings
(5, 2, 'user_105', 2, 150.00, 'confirmed', 'completed', 'BK005-2024', NULL),
(6, 2, 'user_106', 1, 75.00, 'confirmed', 'completed', 'BK006-2024', 'Window seat preferred'),
(7, 2, 'user_107', 6, 450.00, 'confirmed', 'pending', 'BK007-2024', 'Group booking - company outing'),
(8, 2, 'user_108', 2, 150.00, 'cancelled', 'failed', 'BK008-2024', NULL),

-- Garden Wedding Reception bookings
(9, 3, 'user_109', 50, 10000.00, 'confirmed', 'completed', 'BK009-2024', 'Wedding reception - need dance floor and DJ setup'),
(10, 3, 'user_110', 20, 4000.00, 'confirmed', 'completed', 'BK010-2024', 'Family group - need kids menu'),

-- Tech Startup Launch bookings
(11, 4, 'user_111', 1, 50.00, 'confirmed', 'completed', 'BK011-2024', NULL),
(12, 4, 'user_112', 3, 150.00, 'confirmed', 'completed', 'BK012-2024', 'Press credentials required'),
(13, 4, 'user_113', 5, 250.00, 'confirmed', 'pending', 'BK013-2024', 'Investor group - need networking area'),
(14, 4, 'user_114', 2, 100.00, 'pending', 'pending', 'BK014-2024', NULL),
(15, 4, 'user_115', 8, 400.00, 'confirmed', 'completed', 'BK015-2024', 'Team booking - need group seating'),

-- Charity Fundraiser Gala bookings
(16, 5, 'user_116', 2, 250.00, 'confirmed', 'completed', 'BK016-2024', 'VIP table request'),
(17, 5, 'user_117', 4, 500.00, 'confirmed', 'pending', 'BK017-2024', 'Corporate sponsor table'),
(18, 5, 'user_118', 1, 125.00, 'pending', 'pending', 'BK018-2024', 'Accessibility requirements'),

-- House Party Celebration bookings
(19, 6, 'user_119', 8, 360.00, 'pending', 'pending', 'BK019-2024', 'Birthday party - need decorations'),
(20, 6, 'user_120', 4, 180.00, 'confirmed', 'completed', 'BK020-2024', 'Close friends group'),

-- Corporate Holiday Party bookings
(21, 7, 'user_121', 25, 2125.00, 'confirmed', 'completed', 'BK021-2024', 'Corporate event - need AV equipment'),
(22, 7, 'user_122', 15, 1275.00, 'confirmed', 'pending', 'BK022-2024', 'Department party - need team seating'),
(23, 7, 'user_123', 10, 850.00, 'pending', 'pending', 'BK023-2024', 'Executive team booking'),

-- Art Gallery Opening bookings
(24, 8, 'user_124', 2, 70.00, 'confirmed', 'completed', 'BK024-2024', NULL),
(25, 8, 'user_125', 1, 35.00, 'confirmed', 'completed', 'BK025-2024', 'Art collector - interested in private viewing'),
(26, 8, 'user_126', 3, 105.00, 'confirmed', 'pending', 'BK026-2024', 'Art students group'),
(27, 8, 'user_127', 1, 35.00, 'cancelled', 'failed', 'BK027-2024', NULL),

-- Additional diverse bookings for variety
(28, 1, 'user_128', 6, 900.00, 'confirmed', 'completed', 'BK028-2024', 'Large family group - need adjacent tables'),
(29, 2, 'user_129', 2, 150.00, 'pending', 'pending', 'BK029-2024', 'Date night - romantic seating'),
(30, 3, 'user_130', 12, 2400.00, 'confirmed', 'pending', 'BK030-2024', 'Wedding party group'),
(31, 4, 'user_131', 1, 50.00, 'cancelled', 'failed', 'BK031-2024', NULL),
(32, 5, 'user_132', 8, 1000.00, 'confirmed', 'completed', 'BK032-2024', 'Donor table - premium location'),
(33, 7, 'user_133', 20, 1700.00, 'confirmed', 'completed', 'BK033-2024', 'Sales team celebration'),
(34, 8, 'user_134', 2, 70.00, 'pending', 'pending', 'BK034-2024', 'Art enthusiasts couple'),
(35, 6, 'user_135', 3, 135.00, 'confirmed', 'pending', 'BK035-2024', 'Close friends - surprise party');

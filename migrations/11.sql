
-- Insert Concierge Service Providers
INSERT INTO concierge_service_providers (name, description, contact_email, contact_phone, address, city, website_url, logo_url, business_license, is_verified, is_active, rating, commission_rate, payment_terms, specialties, languages, operating_hours) VALUES
('Elite Lagos Concierge', 'Premium concierge services for high-end events and VIP experiences in Lagos', 'contact@elitelagos.com', '+234 803 123 4567', '15 Ahmadu Bello Way, Victoria Island', 'Lagos', 'https://elitelagos.com', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 'RC1234567', 1, 1, 4.8, 15.0, 'net_30', 'VIP table service, luxury transportation, fine dining reservations, celebrity meet & greets', 'English, Yoruba, French', '24/7'),

('Platinum Services Nigeria', 'Luxury lifestyle management and concierge services across Nigeria', 'hello@platinumng.com', '+234 901 987 6543', '45 Adeola Odeku Street, Victoria Island', 'Lagos', 'https://platinumng.com', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', 'RC2345678', 1, 1, 4.6, 12.0, 'net_15', 'Private jet bookings, yacht charters, exclusive event access, personal shopping', 'English, Igbo, Hausa', 'Mon-Sun 6AM-2AM'),

('Royal Touch Concierge', 'Bespoke concierge services for discerning clients', 'info@royaltouch.ng', '+234 802 555 7890', '78 Ozumba Mbadiwe Avenue, Victoria Island', 'Lagos', 'https://royaltouch.ng', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'RC3456789', 1, 1, 4.9, 18.0, 'net_30', 'Hotel bookings, spa treatments, golf course access, cultural experiences', 'English, French, Portuguese', 'Daily 7AM-11PM'),

('Abuja Elite Services', 'Premium concierge services in the Federal Capital Territory', 'services@abujaelite.com', '+234 805 444 3210', '12 Aminu Kano Crescent, Wuse II', 'Abuja', 'https://abujaelite.com', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400', 'RC4567890', 0, 1, 4.3, 10.0, 'immediate', 'Government liaison, diplomatic services, business center access', 'English, Hausa, French', 'Mon-Fri 8AM-8PM'),

('Island Lifestyle Management', 'Complete lifestyle management for Lagos Island residents', 'contact@islandlifestyle.ng', '+234 807 111 2233', '33 Bankole Street, Ikoyi', 'Lagos', 'https://islandlifestyle.ng', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', 'RC5678901', 1, 1, 4.7, 14.0, 'net_30', 'Personal assistant services, household management, event planning', 'English, Yoruba', '24/7');

-- Insert Concierge Staff
INSERT INTO concierge_staff (name, email, phone, position, specialties, hourly_rate, availability_schedule, is_active, provider_id, profile_image, languages, experience_years, rating) VALUES
-- Elite Lagos Concierge Staff
('Adebayo Okonkwo', 'adebayo@elitelagos.com', '+234 803 111 2222', 'Senior Concierge Manager', 'VIP table reservations, celebrity coordination', 25000, 'Mon-Sun 6PM-4AM', 1, 1, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'English, Yoruba', 8, 4.9),
('Chioma Nwankwo', 'chioma@elitelagos.com', '+234 803 222 3333', 'VIP Relations Specialist', 'Fine dining, luxury experiences', 18000, 'Wed-Sun 5PM-2AM', 1, 1, 'https://images.unsplash.com/photo-1494790108755-2616b612b950?w=400', 'English, Igbo, French', 5, 4.8),
('Tunde Bakare', 'tunde@elitelagos.com', '+234 803 333 4444', 'Transportation Coordinator', 'Luxury car service, airport transfers', 15000, 'Daily 24/7', 1, 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'English, Yoruba', 6, 4.7),

-- Platinum Services Nigeria Staff
('Fatima Ibrahim', 'fatima@platinumng.com', '+234 901 111 5555', 'Lifestyle Manager', 'Private aviation, yacht services', 30000, 'Mon-Fri 9AM-9PM', 1, 2, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'English, Hausa, Arabic', 10, 4.9),
('Emeka Okafor', 'emeka@platinumng.com', '+234 901 222 6666', 'Events Coordinator', 'Exclusive events, celebrity access', 22000, 'Thu-Mon 4PM-3AM', 1, 2, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'English, Igbo', 7, 4.6),

-- Royal Touch Concierge Staff
('Aisha Mohammed', 'aisha@royaltouch.ng', '+234 802 777 8888', 'Cultural Experience Specialist', 'Art galleries, cultural tours, spa services', 20000, 'Tue-Sat 10AM-8PM', 1, 3, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'English, Hausa, French', 6, 4.8),
('Kemi Adebowale', 'kemi@royaltouch.ng', '+234 802 888 9999', 'Hospitality Coordinator', 'Hotel bookings, resort reservations', 17000, 'Daily 8AM-10PM', 1, 3, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'English, Yoruba', 4, 4.5),

-- Abuja Elite Services Staff
('Ibrahim Musa', 'ibrahim@abujaelite.com', '+234 805 999 0000', 'Government Liaison', 'Official protocols, diplomatic services', 35000, 'Mon-Fri 8AM-6PM', 1, 4, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'English, Hausa, French', 12, 4.4),

-- Island Lifestyle Management Staff
('Funmi Adeniyi', 'funmi@islandlifestyle.ng', '+234 807 000 1111', 'Personal Assistant Manager', 'Household management, personal errands', 12000, 'Mon-Fri 8AM-6PM', 1, 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', 'English, Yoruba', 3, 4.6),
('David Okoro', 'david@islandlifestyle.ng', '+234 807 111 2222', 'Event Planning Specialist', 'Private parties, corporate events', 16000, 'Wed-Sun 2PM-12AM', 1, 5, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'English', 5, 4.3);

-- Insert Concierge Services
INSERT INTO concierge_services (name, description, category, base_price, price_type, duration_minutes, is_available, provider_id, requirements, max_capacity, advance_booking_hours) VALUES
-- Elite Lagos Concierge Services
('VIP Table Reservation', 'Premium table booking at top Lagos nightclubs with bottle service included', 'vip', 500000, 'fixed', 300, 1, 1, 'Valid ID, dress code compliance', 8, 48),
('Celebrity Meet & Greet', 'Exclusive access to meet celebrities and performers at events', 'entertainment', 250000, 'per_person', 30, 1, 1, 'Background check, signed NDA', 4, 72),
('Luxury Car Service', 'Chauffeur-driven luxury vehicle for the evening', 'transport', 80000, 'hourly', 60, 1, 1, 'Valid pickup/drop-off locations', 4, 24),
('Fine Dining Reservation', 'Reserved tables at Lagos'' most exclusive restaurants', 'dining', 150000, 'fixed', 180, 1, 1, 'Advance menu selection', 6, 48),

-- Platinum Services Nigeria Services
('Private Jet Charter', 'On-demand private aviation services across Nigeria and West Africa', 'transport', 2500000, 'custom', 240, 1, 2, 'Valid passports, flight plan approval', 12, 168),
('Yacht Charter Experience', 'Luxury yacht rental with crew and catering', 'entertainment', 1200000, 'fixed', 480, 1, 2, 'Swimming proficiency, guest manifest', 20, 120),
('Personal Shopping Service', 'Dedicated shopping assistant for luxury brands', 'lifestyle', 50000, 'hourly', 120, 1, 2, 'Budget confirmation, style preferences', 1, 24),
('Exclusive Event Access', 'VIP tickets and backstage access to major events', 'entertainment', 300000, 'per_person', 240, 1, 2, 'Age verification, dress code', 2, 96),

-- Royal Touch Concierge Services
('Spa & Wellness Package', 'Full day luxury spa treatment at premium facilities', 'wellness', 180000, 'fixed', 360, 1, 3, 'Health questionnaire, advance booking', 2, 48),
('Cultural Heritage Tour', 'Guided tour of Lagos cultural sites with expert guide', 'cultural', 75000, 'per_person', 300, 1, 3, 'Comfortable walking shoes', 15, 24),
('Golf Course Access', 'Premium golf course booking with equipment rental', 'recreation', 120000, 'fixed', 240, 1, 3, 'Golf handicap verification', 4, 72),
('Art Gallery Private Viewing', 'Exclusive after-hours art gallery experience', 'cultural', 200000, 'fixed', 120, 1, 3, 'Art appreciation interest', 10, 96),

-- Abuja Elite Services
('Government Protocol Service', 'Official protocol assistance for business meetings', 'business', 150000, 'fixed', 480, 1, 4, 'Business registration, letter of introduction', 5, 120),
('Diplomatic Escort Service', 'Professional escort for diplomatic events', 'business', 200000, 'hourly', 60, 1, 4, 'Security clearance, formal attire', 2, 48),

-- Island Lifestyle Management Services
('Personal Assistant Service', 'Dedicated personal assistant for daily tasks', 'lifestyle', 25000, 'hourly', 60, 1, 5, 'Task briefing, contact information', 1, 12),
('Household Management', 'Complete household staff coordination and management', 'lifestyle', 80000, 'fixed', 480, 1, 5, 'Property access, staff requirements', 1, 24),
('Private Party Planning', 'Complete event planning for private celebrations', 'entertainment', 300000, 'custom', 360, 1, 5, 'Venue confirmation, guest count', 50, 168);


-- Clear existing concierge data
DELETE FROM concierge_requests;
DELETE FROM concierge_services;
DELETE FROM concierge_staff;
DELETE FROM concierge_service_providers;

-- Insert Service Providers
INSERT INTO concierge_service_providers (name, description, contact_email, contact_phone, address, city, website_url, logo_url, is_verified, is_active, rating, commission_rate, payment_terms, specialties, languages, operating_hours) VALUES
('Lagos Premier Concierge', 'Luxury concierge services for high-net-worth individuals in Lagos', 'contact@lagospremier.ng', '+234 901 234 5678', 'Victoria Island', 'Lagos', 'https://lagospremier.ng', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 1, 1, 4.8, 12.0, 'net_15', 'VIP access, luxury dining, private events', 'English, Yoruba, French', 'Mon-Sun: 6AM-11PM'),

('Capital Lifestyle Services', 'Premium lifestyle management and concierge services in Abuja', 'hello@capitallifestyle.ng', '+234 902 345 6789', 'Maitama District', 'Abuja', 'https://capitallifestyle.ng', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400', 1, 1, 4.9, 10.0, 'net_30', 'Government relations, diplomatic services, corporate events', 'English, Hausa, Arabic', 'Mon-Fri: 7AM-9PM, Sat-Sun: 9AM-6PM'),

('Platinum Touch Nigeria', 'Ultra-luxury concierge and lifestyle management', 'info@platinumtouch.ng', '+234 903 456 7890', 'Ikoyi', 'Lagos', 'https://platinumtouch.ng', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', 1, 1, 4.7, 15.0, 'net_15', 'Private aviation, yacht charters, luxury shopping', 'English, French, Italian', '24/7 availability'),

('Royal African Concierge', 'Authentic African luxury experiences and cultural immersion', 'services@royalafrican.ng', '+234 904 567 8901', 'Lekki Phase 1', 'Lagos', 'https://royalafrican.ng', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', 1, 1, 4.6, 8.0, 'net_30', 'Cultural tours, traditional events, heritage experiences', 'English, Yoruba, Igbo, Hausa', 'Mon-Sun: 8AM-8PM'),

('Elite Connect Services', 'Exclusive networking and business concierge services', 'contact@eliteconnect.ng', '+234 905 678 9012', 'Victoria Garden City', 'Lagos', 'https://eliteconnect.ng', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', 1, 1, 4.5, 11.0, 'net_30', 'Business networking, executive services, corporate hospitality', 'English, Portuguese, Spanish', 'Mon-Fri: 8AM-7PM'),

('Island Paradise Concierge', 'Tropical luxury and beach experiences', 'info@islandparadise.ng', '+234 906 789 0123', 'Banana Island', 'Lagos', 'https://islandparadise.ng', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', 0, 1, 4.4, 9.0, 'net_30', 'Beach experiences, water sports, island getaways', 'English, French', 'Mon-Sun: 7AM-10PM');

-- Insert Concierge Staff
INSERT INTO concierge_staff (name, email, phone, position, specialties, hourly_rate, availability_schedule, provider_id, profile_image, languages, experience_years, rating) VALUES
('Adunni Bakare', 'adunni@lagospremier.ng', '+234 801 123 4567', 'senior_concierge', 'VIP dining reservations, luxury shopping, art gallery access', 8500, 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM', 1, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', 'English, Yoruba, French', 7, 4.9),

('Chioma Okafor', 'chioma@lagospremier.ng', '+234 802 234 5678', 'vip_concierge', 'Celebrity access, exclusive events, private parties', 12000, 'Flexible schedule, on-call weekends', 1, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'English, Igbo', 5, 4.8),

('Ibrahim Mansur', 'ibrahim@capitallifestyle.ng', '+234 803 345 6789', 'senior_concierge', 'Government relations, diplomatic protocol, business meetings', 9500, 'Mon-Fri: 8AM-7PM', 2, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'English, Hausa, Arabic, French', 10, 4.9),

('Fatima Abdullahi', 'fatima@capitallifestyle.ng', '+234 804 456 7890', 'event_coordinator', 'Corporate events, conferences, diplomatic receptions', 7500, 'Mon-Sat: 9AM-6PM', 2, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', 'English, Hausa, Arabic', 6, 4.7),

('Alessandro Rodriguez', 'alessandro@platinumtouch.ng', '+234 805 567 8901', 'vip_concierge', 'Private aviation, luxury transportation, international travel', 15000, '24/7 availability for VIP clients', 3, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'English, Italian, Spanish, French', 12, 4.8),

('Kemi Johnson', 'kemi@platinumtouch.ng', '+234 806 678 9012', 'guest_relations', 'Yacht charters, luxury accommodations, spa services', 10500, 'Mon-Sun: 7AM-9PM', 3, 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400', 'English, French', 8, 4.6),

('Emeka Nwosu', 'emeka@royalafrican.ng', '+234 807 789 0123', 'cultural_coordinator', 'Traditional ceremonies, cultural tours, heritage sites', 6500, 'Mon-Sun: 8AM-6PM', 4, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'English, Igbo, Yoruba', 9, 4.5),

('Aisha Bello', 'aisha@royalafrican.ng', '+234 808 890 1234', 'concierge', 'Art galleries, museums, cultural events', 5500, 'Tue-Sun: 10AM-7PM', 4, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'English, Hausa, French', 4, 4.4),

('Michael Thompson', 'michael@eliteconnect.ng', '+234 809 901 2345', 'senior_concierge', 'Business networking, executive services, corporate dining', 11000, 'Mon-Fri: 8AM-6PM', 5, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', 'English, Portuguese', 11, 4.7),

('Ngozi Ekwueme', 'ngozi@eliteconnect.ng', '+234 810 012 3456', 'executive_assistant', 'Personal assistance, travel planning, appointment scheduling', 7000, 'Mon-Fri: 9AM-5PM', 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', 'English, Igbo', 6, 4.6),

('David Martinez', 'david@islandparadise.ng', '+234 811 123 4567', 'beach_coordinator', 'Water sports, beach experiences, island tours', 8000, 'Mon-Sun: 7AM-7PM', 6, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'English, Spanish', 5, 4.3),

('Folake Adebayo', 'folake@islandparadise.ng', '+234 812 234 5678', 'guest_relations', 'Beach club access, water activities, tropical experiences', 6000, 'Thu-Mon: 10AM-8PM', 6, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'English, Yoruba', 3, 4.2);

-- Insert Concierge Services
INSERT INTO concierge_services (name, description, category, base_price, price_type, duration_minutes, provider_id, requirements, max_capacity, advance_booking_hours) VALUES
('VIP Restaurant Reservations', 'Exclusive table bookings at Lagos finest restaurants with priority seating', 'dining', 25000, 'fixed', 180, 1, 'Valid ID required, smart casual dress code', 8, 4),

('Private Shopping Experience', 'Personal shopping with luxury brand access and private showroom tours', 'shopping', 75000, 'hourly', 240, 1, 'Minimum spend requirement may apply', 4, 24),

('Celebrity Meet & Greet', 'Exclusive access to celebrities and influencers at private events', 'entertainment', 150000, 'per_person', 60, 1, 'Background check required, NDA signing', 2, 72),

('Government Liaison Services', 'Professional assistance with government offices and diplomatic missions', 'other', 50000, 'hourly', NULL, 2, 'Valid business registration, appointment scheduling', 1, 48),

('Executive Airport Transfer', 'Luxury transportation with meet-and-greet and priority services', 'transport', 35000, 'fixed', 120, 2, 'Flight details required 2 hours in advance', 6, 2),

('Diplomatic Event Planning', 'Full-service event coordination for diplomatic and corporate functions', 'events', 200000, 'custom', NULL, 2, 'Minimum 2 weeks notice, security clearance', 200, 336),

('Private Jet Charter', 'Luxury aircraft rental for domestic and international travel', 'transport', 2500000, 'per_person', NULL, 3, 'Passport required for international flights', 12, 24),

('Luxury Yacht Charter', 'Premium yacht rental with crew and catering services', 'entertainment', 850000, 'fixed', 480, 3, 'Valid ID, yacht safety briefing required', 20, 72),

('Personal Spa Butler', 'Dedicated spa attendant for personalized wellness experiences', 'vip', 45000, 'hourly', 120, 3, 'Health questionnaire, 18+ only', 2, 12),

('Cultural Heritage Tour', 'Authentic Nigerian cultural experiences with expert guides', 'entertainment', 18000, 'per_person', 300, 4, 'Comfortable walking shoes recommended', 15, 24),

('Traditional Wedding Planning', 'Full coordination of traditional Nigerian wedding ceremonies', 'events', 500000, 'custom', NULL, 4, 'Minimum 8 weeks notice, family consultations', 500, 1344),

('Art Gallery Private Viewing', 'Exclusive after-hours access to premier Nigerian art galleries', 'entertainment', 30000, 'per_person', 120, 4, 'Art appreciation background preferred', 10, 48),

('Business Networking Events', 'Curated networking opportunities with industry leaders', 'other', 65000, 'per_person', 180, 5, 'Professional attire, business cards required', 50, 72),

('Executive Golf Access', 'Private golf course access with professional instruction', 'entertainment', 95000, 'fixed', 300, 5, 'Golf attire required, handicap assessment', 4, 24),

('Island Day Trip', 'Full-day tropical island experience with activities and dining', 'entertainment', 55000, 'per_person', 480, 6, 'Swimming ability required, sun protection recommended', 12, 48),

('Sunset Beach Dinner', 'Romantic beachside dining with live entertainment', 'dining', 40000, 'per_person', 180, 6, 'Smart casual beachwear, advance dietary preferences', 20, 24),

('Water Sports Adventure', 'Jet skiing, parasailing, and water activities with equipment', 'entertainment', 28000, 'per_person', 240, 6, 'Swimming proficiency required, age 16+', 8, 12);

-- Insert Concierge Requests
INSERT INTO concierge_requests (user_id, provider_id, concierge_id, service_id, request_type, title, description, preferred_date, preferred_time, guest_count, budget_range, special_requirements, status, priority, assigned_at, completed_at, total_cost, payment_status, customer_rating, customer_feedback, internal_notes) VALUES
('user_001', 1, 1, 1, 'dining', 'Anniversary Dinner at Noir', 'Need VIP table for wedding anniversary at best restaurant in Lagos', '2024-02-14', '20:00', 2, '50000-100000', 'Champagne service, flower arrangement', 'completed', 'high', '2024-02-10 14:30:00', '2024-02-14 22:30:00', 75000, 'paid', 5, 'Absolutely perfect evening! The table had amazing view and service was impeccable.', 'Reserved corner table with harbor view. Arranged rose petals and champagne. Client extremely satisfied.'),

('user_002', 3, 5, 7, 'transport', 'Private Jet to London', 'Urgent business travel to London for board meeting', '2024-02-20', '06:00', 4, '3000000-5000000', 'In-flight catering, ground transportation in London', 'completed', 'urgent', '2024-02-18 09:15:00', '2024-02-20 08:00:00', 4200000, 'paid', 4, 'Flight was smooth and professional. Ground service could be improved.', 'Arranged Gulfstream G650 with London ground transport. Minor delay with catering supplier but overall successful.'),

('user_003', 4, 7, 10, 'entertainment', 'Cultural Tour for Visitors', 'Want to show visiting German investors authentic Nigerian culture', '2024-02-25', '10:00', 6, '100000-200000', 'English and German speaking guide if possible', 'completed', 'normal', '2024-02-22 11:00:00', '2024-02-25 16:00:00', 135000, 'paid', 5, 'Exceptional experience! Our guests were amazed by the cultural depth and knowledge of the guide.', 'Arranged bilingual guide (English/German). Visited National Museum, Nike Art Gallery, and traditional market. Clients very impressed.'),

('user_004', 2, 3, 4, 'other', 'Business Registration Assistance', 'Need help navigating CAC registration for new tech startup', '2024-03-01', '09:00', 1, '100000-150000', 'Documentation review, process acceleration', 'in_progress', 'normal', '2024-02-28 10:30:00', NULL, 85000, 'pending', NULL, NULL, 'Documentation submitted. Waiting for CAC approval. Expedited processing requested through liaison contacts.'),

('user_005', 6, 11, 15, 'entertainment', 'Beach Team Building', 'Corporate team building event for 25 employees', '2024-03-10', '09:00', 25, '500000-800000', 'Team building activities, lunch included', 'in_progress', 'normal', '2024-03-05 14:00:00', NULL, 650000, 'pending', NULL, NULL, 'Coordinating with resort for exclusive beach access. Activities include volleyball, treasure hunt, BBQ lunch.'),

('user_006', 1, 2, 3, 'entertainment', 'Celebrity Appearance', 'Want to surprise wife with Davido appearance at birthday party', '2024-03-15', '19:00', 50, '1000000-2000000', 'Private performance, photo opportunities', 'assigned', 'high', '2024-03-08 16:45:00', NULL, NULL, 'pending', NULL, NULL, 'Reached out to artist management. Negotiating fee and availability. Security requirements being assessed.'),

('user_007', 5, 9, 13, 'other', 'Investment Summit Access', 'Need access to exclusive Nigeria Investment Summit', '2024-03-20', '08:00', 2, '200000-300000', 'VIP badge, networking lounge access', 'assigned', 'high', '2024-03-12 09:20:00', NULL, NULL, 'pending', NULL, NULL, 'VIP tickets secured. Arranged networking breakfast and exclusive investor lounge access.'),

('user_008', 3, 6, 8, 'entertainment', 'Yacht Bachelor Party', 'Planning bachelor party on luxury yacht for weekend', '2024-03-25', '14:00', 15, '1500000-2500000', 'DJ, catering, beverages, decorations', 'pending', 'normal', NULL, NULL, NULL, 'pending', NULL, NULL, NULL),

('user_009', 4, 8, 11, 'events', 'Traditional Wedding', 'Full traditional Igbo wedding ceremony coordination', '2024-05-18', '10:00', 300, '3000000-5000000', 'Traditional attire coordination, live band, photographer', 'pending', 'normal', NULL, NULL, NULL, 'pending', NULL, NULL, NULL),

('user_010', 2, 4, 6, 'events', 'Corporate Gala', 'Annual company gala for 200 executives and partners', '2024-04-12', '18:00', 200, '2000000-4000000', 'Red carpet, live entertainment, formal dinner', 'pending', 'high', NULL, NULL, NULL, 'pending', NULL, NULL, NULL),

('user_011', 6, 12, 16, 'dining', 'Romantic Beach Proposal', 'Planning surprise proposal dinner on the beach', '2024-03-18', '18:30', 2, '100000-200000', 'Private setup, photographer, ring presentation coordination', 'cancelled', 'high', '2024-03-10 11:30:00', NULL, NULL, 'refunded', NULL, NULL, 'Client cancelled due to relationship issues. Full refund processed.');

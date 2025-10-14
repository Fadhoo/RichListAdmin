
-- Remove sample bookings
DELETE FROM bookings WHERE id BETWEEN 1 AND 35;

-- Remove sample events
DELETE FROM events WHERE id BETWEEN 1 AND 8;

-- Remove sample venues
DELETE FROM venues WHERE id BETWEEN 1 AND 5;

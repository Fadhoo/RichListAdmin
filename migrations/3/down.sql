
-- Remove the added sample data
DELETE FROM bookings WHERE id > 2;
DELETE FROM venues WHERE id > 3;
DELETE FROM events WHERE id > 3;

-- Reset image URLs
UPDATE venues SET image_url = null WHERE id IN (1, 2);
UPDATE events SET image_url = null WHERE id IN (1, 2);

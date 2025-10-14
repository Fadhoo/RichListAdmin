
-- Remove all sample stories (keeping any existing ones with IDs below what we inserted)
DELETE FROM stories WHERE id >= (SELECT MIN(id) FROM (SELECT id FROM stories ORDER BY id DESC LIMIT 20));

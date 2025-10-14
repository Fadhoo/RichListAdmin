
-- Remove sample story interactions
DELETE FROM story_interactions WHERE story_id IN (SELECT id FROM stories WHERE title LIKE '%DJ Setup%' OR title LIKE '%Cocktail Menu%' OR title LIKE '%Fashion Week%');

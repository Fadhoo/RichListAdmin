
-- Insert additional story interactions to make the data more realistic
INSERT INTO story_interactions (story_id, user_id, interaction_type, metadata) VALUES
(1, 'user_001', 'view', '{"device": "mobile", "duration": 15}'),
(1, 'user_002', 'like', '{"timestamp": "2024-10-14 12:05:00"}'),
(1, 'user_003', 'share', '{"platform": "whatsapp"}'),
(2, 'user_004', 'view', '{"device": "desktop", "duration": 22}'),
(2, 'user_005', 'like', '{"timestamp": "2024-10-13 16:00:00"}'),
(3, 'user_006', 'view', '{"device": "mobile", "duration": 30}'),
(3, 'user_007', 'like', '{"timestamp": "2024-10-12 18:30:00"}'),
(3, 'user_008', 'share', '{"platform": "instagram"}'),
(3, 'user_009', 'share', '{"platform": "twitter"}'),
(4, 'user_010', 'view', '{"device": "tablet", "duration": 18}'),
(5, 'user_011', 'view', '{"device": "mobile", "duration": 25}'),
(5, 'user_012', 'like', '{"timestamp": "2024-10-10 15:15:00"}'),
(6, 'user_013', 'view', '{"device": "desktop", "duration": 12}'),
(7, 'user_014', 'view', '{"device": "mobile", "duration": 28}'),
(7, 'user_015', 'like', '{"timestamp": "2024-10-08 13:45:00"}'),
(8, 'user_016', 'view', '{"device": "mobile", "duration": 20}'),
(8, 'user_017', 'share', '{"platform": "facebook"}'),
(9, 'user_018', 'view', '{"device": "desktop", "duration": 35}'),
(9, 'user_019', 'like', '{"timestamp": "2024-10-06 20:00:00"}'),
(10, 'user_020', 'view', '{"device": "mobile", "duration": 16}');

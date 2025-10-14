
-- Remove the added user data
DELETE FROM user_activities WHERE user_id IN ('user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010', 'user_011', 'user_012');
DELETE FROM user_subscriptions WHERE user_id IN ('user_004', 'user_005', 'user_008', 'user_010', 'user_012');
DELETE FROM users WHERE id IN ('user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010', 'user_011', 'user_012');

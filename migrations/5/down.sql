
DROP INDEX idx_users_active;
DROP INDEX idx_users_email;
DELETE FROM user_activities WHERE user_id IN ('user_001', 'user_002', 'user_003', 'user_004');
DELETE FROM user_subscriptions WHERE user_id IN ('user_001', 'user_002', 'user_003', 'user_004');
DELETE FROM users WHERE id IN ('user_001', 'user_002', 'user_003', 'user_004');
DROP TABLE users;

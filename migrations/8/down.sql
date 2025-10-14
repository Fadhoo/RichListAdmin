
-- Remove added columns from user_subscriptions
ALTER TABLE user_subscriptions DROP COLUMN cancellation_reason;
ALTER TABLE user_subscriptions DROP COLUMN cancelled_at;
ALTER TABLE user_subscriptions DROP COLUMN auto_renew;

-- Drop indexes
DROP INDEX idx_user_preferences_user_id;
DROP INDEX idx_subscription_changes_user_id;
DROP INDEX idx_payment_records_status;
DROP INDEX idx_payment_records_user_id;
DROP INDEX idx_user_invitations_status;
DROP INDEX idx_user_invitations_email;
DROP INDEX idx_user_roles_user_id;

-- Drop new tables
DROP TABLE user_preferences;
DROP TABLE subscription_changes;
DROP TABLE payment_records;
DROP TABLE user_invitations;
DROP TABLE user_roles;

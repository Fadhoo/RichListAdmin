
-- Drop indexes first
DROP INDEX IF EXISTS idx_concierge_requests_date;
DROP INDEX IF EXISTS idx_concierge_requests_status;
DROP INDEX IF EXISTS idx_concierge_requests_concierge;
DROP INDEX IF EXISTS idx_concierge_requests_user;
DROP INDEX IF EXISTS idx_concierge_services_category;
DROP INDEX IF EXISTS idx_concierge_services_venue;
DROP INDEX IF EXISTS idx_concierge_staff_active;
DROP INDEX IF EXISTS idx_concierge_staff_venue;

-- Drop tables
DROP TABLE IF EXISTS concierge_requests;
DROP TABLE IF EXISTS concierge_services;
DROP TABLE IF EXISTS concierge_staff;

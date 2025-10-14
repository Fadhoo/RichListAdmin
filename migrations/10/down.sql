
-- Drop indexes
DROP INDEX idx_concierge_service_providers_verified;
DROP INDEX idx_concierge_service_providers_active;
DROP INDEX idx_concierge_requests_provider_id;
DROP INDEX idx_concierge_services_provider_id;
DROP INDEX idx_concierge_staff_provider_id;

-- Remove provider_id columns
ALTER TABLE concierge_requests DROP COLUMN provider_id;
ALTER TABLE concierge_services DROP COLUMN provider_id;
ALTER TABLE concierge_staff DROP COLUMN provider_id;

-- Drop concierge service providers table
DROP TABLE concierge_service_providers;

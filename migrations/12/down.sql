
-- Remove sample requests and reset ratings
DELETE FROM concierge_requests;

UPDATE concierge_service_providers SET 
    rating = 0, 
    total_requests = 0;

UPDATE concierge_staff SET 
    rating = 0, 
    total_requests = 0;

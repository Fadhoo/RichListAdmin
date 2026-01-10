/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConciergeService {
  id: string;
  name: string;
  description?: string;
  conciergeId: string; // Reference to ConciergeProvider
  imageId?: string;
  category?: string;
  serviceProducts?: string[]; // Array of ConciergeServiceProduct IDs
  price?: number;
  currency?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

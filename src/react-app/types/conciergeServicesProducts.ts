/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConciergeServiceProduct {
  id: string;
  name: string;
  description?: string;
  price?: number;
  halfDay?: number;
  fullDay?: number;
  airportPickUp?: number;
  currency: string;
  conciergeService: string; // Reference to ConciergeService
  conciergeProvider?: string; // Reference to ConciergeProvider
  imageUrl?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

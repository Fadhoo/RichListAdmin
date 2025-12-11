// import { z } from "zod";

// Venue type based on shared/types.ts VenueSchema
export type Venue = {
	id: string;
	name: string;
	desc?: string | null;
	location?: string | null;
	city?: string | null;
	phone?: string | null;
	email?: string | null;
	imageId?: string | null;
	rank?: number | null;
    image_url?: string | null;
	capacity?: number | null;
	isActive?: boolean | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateVenue = {
	name: string;
	desc?: string;
	location?: string;
	city?: string;
	phone?: string;
	rank?: number;
	email?: string;
	imageId: string;
    image_url?: string;
	capacity?: number;
	isActive?: boolean | null;
};

// Optionally, export Zod schemas if needed in this file
// import { VenueSchema, CreateVenueSchema } from '../../shared/types';

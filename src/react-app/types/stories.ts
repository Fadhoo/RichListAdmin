import { Venue } from "./venue";
import { Event } from "./events";

// Story type based on Mongoose schema
export interface Story {
	_id: string;
	venueId?: string | Venue | null;
	showId?: string | Event | null;
	title: string;
	media?: string;
	thumbnail?: string;
	tags: string[];
	isActive: boolean;
	metadata: Record<string, any>;
	views: number;
	publishedAt: string; // ISO date string
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
}

// For paginated responses
export interface StoryPaginated {
	results: Story[];
	page: number;
	limit: number;
	totalPages: number;
	totalResults: number;
}

import { Venue } from "./venue";
import { Event } from "./events";

// Story type based on Mongoose schema
export interface Story {
	id?: string;
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

// Story with populated references
export interface StoryWithDetails extends Story {
  venue?: Venue;
  event?: Event;
  author?: {
    id: string;
    email: string;
    name?: string;
  };
}

// For creating/editing stories
export interface CreateStory {
  title: string;
  content?: string;
  story_type: string;
  venue_id?: string;
  event_id?: string;
  media_url: string;
  media_type: 'video';
  is_featured?: boolean;
  publish_date?: string;
  expires_at?: string;
  tags?: string;
}

// For paginated responses
export interface StoryPaginated {
	results: Story[];
	page: number;
	limit: number;
	totalPages: number;
	totalResults: number;
}

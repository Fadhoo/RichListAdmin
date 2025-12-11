import { Venue } from "./venue";

export type Event = {
	id: string;
	name: string;
	desc?: string | null;
	venueId: string | Venue;
	promoterId?: string | null;
	date: string;
	time?: string | null;
	rank?: number | null;
	duration?: string | null;
	price?: number | null;
	totalTickets?: number | null;
	imageId?: string | null;
	status: string;
	tags?: string[] | null;
    type: string;
    isActive: boolean;
    typeOfShow: string;
	isFeatured: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CreateEvent = {
	// id: number;
	name: string;
	desc?: string | null;
	venueId: string;
	promoterId?: string | null;
	rank?: number | null;
	date: string;
	time?: string | null;
	duration?: string | null;
	price?: number | null;
	totalTickets?: number | null;
	imageId?: string | null;
	status?: string;
	isFeatured: boolean;
	tags?: string[] | null;
    type: string;
    isActive?: boolean;
    typeOfShow?: string;
};

export type UpdateEventStatus = {
	status: 'pending' | 'approved' | 'rejected' | 'cancelled';
};

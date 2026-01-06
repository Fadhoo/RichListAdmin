/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Event } from "./events"; 
export type Booking = {
	id?: string;
	showId: Event;
	userId?: string;
	guestCount: number;
	totalAmount?: number;
	conciergeId?: string;
	status: string;
	paymentId?: string;
	bookingReference?: string | null;
	location?: string | null;
	note?: string | null;
	createdAt: string;
	updatedAt: string;
	paymentProviderId?: string | null;
	quantity?: number | null;
};

export type getBookingResponse = {
    results: Booking[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
};

export type BookingWithDetails = Booking & {
	userDetails: {};
	paymentDetails: {};
};

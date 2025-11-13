import { Event } from "./events"; 
export type Booking = {
	id?: string;
	showId: Event;
	userId?: string;
	guestCount: number;
	totalAmount?: number;
	status: string;
	paymentId?: string;
	reference?: string | null;
	note?: string | null;
	createdAt: string;
	updatedAt: string;
};

export type getBookingResponse = {
    results: Booking[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { Booking } from "../types/bookings";
import { GetPaginatedDataResponse } from "../types/apiResponse";

// // Placeholder Booking type
// export type Booking = any;
// export type Booking = any;

export const createBooking = async (data: Booking) => {
  const url = "/v1/bookings";
  try {
    const response = await axiosInstance().post(url, data);
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchBookings = async (
  page: number,
  limit: number,
  search: string,
  sortBy = "createdAt:desc"
) => {
  const url = "/v1/bookings";
  try {
    const response: AxiosResponse<GetPaginatedDataResponse<Booking[]>> = await axiosInstance().get(url, {
      params: {
        page,
        sortBy,
        populate: 'showId,showId.venueId',
        limit,
        ...(search ? { search } : {}),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editBooking = async (id: string, data: Booking) => {
  const url = `/v1/bookings/${id}`;
  try {
    const response = await axiosInstance().patch(url, data);
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteBooking = async (id: string) => {
  const url = `/v1/bookings/${id}`;
  try {
    const response = await axiosInstance().delete(url);
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

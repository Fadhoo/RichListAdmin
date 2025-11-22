/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
// import { Event, CreateEvent } from "../types/shows";
import { GetPaginatedDataResponse } from "../types/apiResponse";
import { toast } from "react-toastify";

// Placeholder Event type
export type Event = any;
export type CreateEvent = any;

export const createEvent = async (data: CreateEvent) => {
  const url = "/v1/shows";
  try {
    const response = await axiosInstance().post(url, data);
    toast.success("Event created successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchEvents = async (
  page: number,
  limit: number,
  search: string,
  sortBy = "createdAt:desc"
) => {
  const url = "/v1/shows";
  try {
    const response: AxiosResponse<GetPaginatedDataResponse<Event[]>> = await axiosInstance().get(url, {
      params: {
        page,
        sortBy,
        limit,
        ...(search ? { search } : {}),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editEvent = async (id: string, data: CreateEvent) => {
  const url = `/v1/shows/${id}`;
  try {
    const response = await axiosInstance().patch(url, data);
    toast.success("Event updated successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteEvent = async (id: string) => {
  const url = `/v1/shows/${id}`;
  try {
    const response = await axiosInstance().delete(url);
    toast.success("Event deleted successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { Venue, CreateVenue } from "../types/venue";
// import { toast } from "react-toastify";
import { GetPaginatedDataResponse } from "../types/apiResponse";

export const createVenue = async (data: CreateVenue) => {
  const url = "/v1/venues";

  try {
    const response = await axiosInstance().post(url, data);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchVenues = async (page: number, limit: number, search: string, sortBy="createdAt:desc") => {
  const url = "/v1/venues";

  try {
    const response: AxiosResponse<GetPaginatedDataResponse<Venue[]>> = await axiosInstance().get(url, {
      params: {
        page,
        sortBy,
        limit,
        ...(search ? { search } : {}),
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editVenue = async (id: string, data: CreateVenue) => {
  const url = `/v1/venues/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteVenue = async (id: string) => {
  const url = `/v1/venues/${id}`;

  try {
    const response = await axiosInstance().delete(url);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

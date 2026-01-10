/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { ConciergeProvider } from "../types/conciergeProviders";
import { toast } from "react-toastify";
import { GetPaginatedDataResponse } from "../types/apiResponse";

export const createConciergeProvider = async (data: ConciergeProvider) => {
  const url = "/v1/conciergeProviders";

  try {
    const response = await axiosInstance().post(url, data);

    toast.success("ConciergeProvider created successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchConciergeProviders = async (page: number, limit: number, search: string, sortBy=undefined) => {
  const url = "/v1/conciergeProviders";
  console.log("Fetching conciergeProviders with sortBy:", sortBy);

  try {
    const response: AxiosResponse<GetPaginatedDataResponse<ConciergeProvider[]>> = await axiosInstance().get(url, {
      params: {
        page,
        // sortBy,
        limit,
        ...(search ? { search } : {}),
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editConciergeProvider = async (id: string, data: ConciergeProvider) => {
  const url = `/v1/conciergeProviders/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteConciergeProvider = async (id: string) => {
  const url = `/v1/conciergeProviders/${id}`;

  try {
    const response = await axiosInstance().delete(url);
    toast.success("ConciergeProvider deleted successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

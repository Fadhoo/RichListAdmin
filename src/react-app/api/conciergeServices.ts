/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { ConciergeService } from "../types/conciergeServices";
import { toast } from "react-toastify";
import { GetPaginatedDataResponse } from "../types/apiResponse";

export const createConciergeService = async (data: Omit<ConciergeService, 'id' | 'createdAt' | 'updatedAt'>) => {
  const url = "/v1/conciergeServices";

  try {
    const response = await axiosInstance().post(url, data);

    toast.success("ConciergeService created successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchConciergeServices = async (page: number, limit: number, search: string, sortBy=undefined) => {
  const url = "/v1/conciergeServices";
  console.log("Fetching conciergeServices with sortBy:", sortBy);

  try {
    const response: AxiosResponse<GetPaginatedDataResponse<ConciergeService[]>> = await axiosInstance().get(url, {
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

export const fetchConciergeServiceById = async (id: string) => {
  const url = `/v1/conciergeServices/${id}`;
  try {
    const response = await axiosInstance().get(url);
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editConciergeService = async (id: string, data: Omit<ConciergeService, 'id' | 'createdAt' | 'updatedAt'>) => {
  const url = `/v1/conciergeServices/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteConciergeService = async (id: string) => {
  const url = `/v1/conciergeServices/${id}`;

  try {
    const response = await axiosInstance().delete(url);
    toast.success("ConciergeService deleted successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

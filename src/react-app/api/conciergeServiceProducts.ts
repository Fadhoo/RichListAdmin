/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { ConciergeServiceProduct } from "../types/conciergeServicesProducts";
import { toast } from "react-toastify";
import { GetPaginatedDataResponse } from "../types/apiResponse";

export const createConciergeServiceProduct = async (data: ConciergeServiceProduct) => {
  const url = "/v1/conciergeServiceProducts";

  try {
    const response = await axiosInstance().post(url, data);

    toast.success("ConciergeServiceProduct created successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchConciergeServiceProducts = async (page: number, limit: number, search: string, sortBy=undefined) => {
  const url = "/v1/conciergeServiceProducts";
  console.log("Fetching conciergeServiceProducts with sortBy:", sortBy);

  try {
    const response: AxiosResponse<GetPaginatedDataResponse<ConciergeServiceProduct[]>> = await axiosInstance().get(url, {
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

export const editConciergeServiceProduct = async (id: string, data: ConciergeServiceProduct) => {
  const url = `/v1/conciergeServiceProducts/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteConciergeServiceProduct = async (id: string) => {
  const url = `/v1/conciergeServiceProducts/${id}`;

  try {
    const response = await axiosInstance().delete(url);
    toast.success("ConciergeServiceProduct deleted successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

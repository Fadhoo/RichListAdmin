/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { CreateCategory, GetCategoryiesResponse } from "../types/categories";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

export const createCategory = async (data: CreateCategory) => {
  const url = "/v1/categories";

  try {
    const response = await axiosInstance().post(url, data);
    toast.success("Category created successfully");

    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchCategorys = async (
  page: number,
  limit: number,
  venueId: string
) => {
  const url = "/v1/categories";

  try {
    const response: AxiosResponse<GetCategoryiesResponse> = await axiosInstance().get(url, {
      params: {
        page,
        limit,
        sortBy: "name:desc",
        // populate: "categoryId",
        venueId,
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editCategory = async (id: string, data: CreateCategory) => {
  const url = `/v1/categories/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteCategory = async (id: string) => {
  const url = `/v1/categories/${id}`;

  try {
    const response = await axiosInstance().delete(url);

    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { Story } from "../types/stories";
import { toast } from "react-toastify";
import { GetPaginatedDataResponse } from "../types/apiResponse";

export const createStory = async (data: Omit<Story, '_id' | 'createdAt' | 'updatedAt' | 'views' | 'publishedAt'>) => {
  const url = "/v1/stories";
  try {
    const response = await axiosInstance().post(url, data);
    toast.success("Story created successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchStoriesAPI = async (page: number, limit: number, search: string, sortBy = "createdAt:desc") => {
  const url = "/v1/stories";
  try {
    const response: AxiosResponse<GetPaginatedDataResponse<Story[]>> = await axiosInstance().get(url, {
      params: {
        page,
        sortBy,
        limit,
        ...(search ? { search } : {}),
        populate: 'venueId,showId',
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editStory = async (id: string, data: Partial<Story>) => {
  const url = `/v1/stories/${id}`;
  try {
    const response = await axiosInstance().patch(url, data);
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteStory = async (id: string) => {
  const url = `/v1/stories/${id}`;
    try {
    const response = await axiosInstance().delete(url);
    toast.success("Story deleted successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};
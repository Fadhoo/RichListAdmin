/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { User } from "../types/users";
import { toast } from "react-toastify";
import { GetPaginatedDataResponse } from "../types/apiResponse";

export const createUser = async (data: User) => {
  const url = "/v1/users";

  try {
    const response = await axiosInstance().post(url, data);

    toast.success("User created successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchUsers = async (page: number, limit: number, search: string, sortBy="createdAt:desc") => {
  const url = "/v1/users";

  try {
    const response: AxiosResponse<GetPaginatedDataResponse<User[]>> = await axiosInstance().get(url, {
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

export const editUser = async (id: string, data: Partial<User>) => {
  const url = `/v1/users/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteUser = async (id: string) => {
  const url = `/v1/users/${id}`;

  try {
    const response = await axiosInstance().delete(url);
    toast.success("User deleted successfully");
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

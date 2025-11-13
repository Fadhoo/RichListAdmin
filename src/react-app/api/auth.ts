/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { LoginBody, LoginResponseData, RegisterBody } from "../types/auth";
// import { ApiResponse } from "../types/apiResponse";
import { axiosInstance } from "../hooks/useAxios";
import { toast } from "react-toastify";

export const register = async (data: RegisterBody) => {
  const url = "/v1/auth/register";

  try {
    // revert to API RESPONSE when this is corrected
    const response: AxiosResponse<LoginResponseData> = await axiosInstance().post(url, data);

    return response.data;
  } catch (error: any) {
    toast.error(error);
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const login = async (data: LoginBody) => {
  const url = "/v1/auth/login";

  try {
    // revert to API RESPONSE when this is corrected
    const response: AxiosResponse<LoginResponseData> = await axiosInstance().post(url, data);

    return response.data;
  } catch (error: any) {
    toast.error(error);
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  const url = "/v1/auth/forgot-password";

  try {
    // revert to API RESPONSE when this is corrected
    const response: AxiosResponse<LoginResponseData> = await axiosInstance().post(url, data);

    return response.data;
  } catch (error: any) {
    toast.error(error);
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const resetPassword = async (token: string, password: string) => {
  const url = `/v1/auth/reset-password?token=${token}`;

  try {
    // revert to API RESPONSE when this is corrected
    const response: AxiosResponse<LoginResponseData> = await axiosInstance().post(url, { password });

    return response.data;
  } catch (error: any) {
    toast.error(error);
    throw new Error(error ? error : "Please check your internet connection");
  }
};

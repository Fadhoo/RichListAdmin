/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { logout } from "../lib/localStorage";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const axiosInstance = (baseURL = baseUrl) => {
  const base = axios.create({
    baseURL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  base.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("tkn");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  base.interceptors.response.use(
    (response) => response,
    (error) => {
      let errorResponse: any;

      if (error.response) {
        if (error.response.status <= 500 && error.response.status !== 404) {
          errorResponse = error.response.data.message;
          if (errorResponse === "Please authenticate") {
            logout();
          }
        } else if (error.response.status >= 500 && error.response.status < 600) {
          errorResponse = "Server error";
        } else {
          errorResponse = error.response.data.message;
        }
      } else if (error.request) {
        errorResponse = error.message + ". Please check your internet connection";
      }

      return Promise.reject(errorResponse);
    }
  );

  return base;
};

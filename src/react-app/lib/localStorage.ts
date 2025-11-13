// import { Shop } from "../types/shops";
import type { User } from "../types/users";

export const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.replace("/");
};

export const getToken = () => localStorage.getItem("tkn");

export const getUser = (): User | null => {
  const rawData = localStorage.getItem("user");
  if (rawData) {
    return JSON.parse(rawData);
  } else {
    return null;
  }
};

export const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;

export const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
};

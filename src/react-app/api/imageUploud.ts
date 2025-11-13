/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";

export const uploadImageToCloud = async (file: File) => {
  const url = "/v1/imageKit/upload";
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("fileName", file.name);
    // formData.append("folder", "/venues");
    try {
    const response = await axiosInstance().post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Image upload response:", response);
    return response;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
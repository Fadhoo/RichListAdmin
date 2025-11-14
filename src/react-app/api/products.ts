/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { axiosInstance } from "../hooks/useAxios";
import { CreateProductBody, GetProductsResponse } from "../types/products";
// import { toast } from "react-toastify";

export const createProduct = async (data: CreateProductBody) => {
  const url = "/v1/products";

  try {
    const response = await axiosInstance().post(url, data);

    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const fetchProducts = async (
  page: number,
  limit: number,
  categoryId?: string | null,
  search?: string | null,
  venueId?: string | null
) => {
  const url = "/v1/products";

  try {
    const response: AxiosResponse<GetProductsResponse> = await axiosInstance().get(url, {
      params: {
        page,
        limit,
        venueId,
        categoryId: categoryId === "all" ? null : categoryId,
        search,
        sortBy: "createdAt:desc",
        populate: "categoryId",
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

// an array of { productId, updateBody }
export const updateProductsInBulk = async (productsToUpdate: { productId: string; updateBody: Partial<CreateProductBody> }[], venueId: string
) => {
  const url = `/v1/products/bulk-update`;
  try {
    console.log("Updating products in bulk:", { venueId, updateBody: productsToUpdate, });
    const response = await axiosInstance().patch(url, { 
      venueId,
      updateBody: productsToUpdate,
    });
    
    return response;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const editProduct = async (id: string, data: CreateProductBody) => {
  const url = `/v1/products/${id}`;

  try {
    const response = await axiosInstance().patch(url, data);

    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

export const deleteProduct = async (id: string) => {
  const url = `/v1/products/${id}`;

  try {
    const response = await axiosInstance().delete(url);

    return response.data;
  } catch (error: any) {
    throw new Error(error ? error : "Please check your internet connection");
  }
};

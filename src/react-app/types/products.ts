import { Category } from "./categories";

export type Product = {
  tags: string[];
  name: string;
  price: number;
  desc: string;
  categoryId: Category; 
  newCategory?: string;
  venueId: string;
  brand: string;
  id: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GetProductsResponse = {
  results: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type CreateProductBody = {
  name: string;
  price: number;
  desc: string;
  categoryId: string;
  venueId: string;
  initialInventoryQuantity?: number;
};

export type EditProductBody = {
  name: string;
  price: number;
  desc: string;
};

export type CreateCategory = {
  name: string;
  desc: string;
};

export type Category = CreateCategory & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetCategoryiesResponse = {
  results: Category[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

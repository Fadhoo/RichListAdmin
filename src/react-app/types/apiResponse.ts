export interface ApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}

export type GetPaginatedDataResponse<T> = {
  results: T;
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

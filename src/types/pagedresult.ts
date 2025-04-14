import { apiResponse } from "./apiResponse.type";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface Page<T> extends apiResponse<PagedResult<T>> {}

import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;
export const MAX_PER_PAGE = 100;

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginationOptions<T> {
  page?: number;
  perPage?: number;
  where?: FindOptionsWhere<T>;
  relations?: FindOptionsRelations<T>;
}

import { PaginationResult } from '../database/pagination.types';
import { ErrorCode } from './errorCode.enum';

export interface ApiResponseBody<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  meta?: Omit<PaginationResult<T>, 'data'>;
  errorCode?: ErrorCode;
  path?: string;
}

const getTimestamp = () => new Date().toISOString();

export class ApiResult {
  static success<T>(
    data: T,
    path: string,
    message: string = 'Operation successful',
  ): ApiResponseBody<T> {
    return {
      success: true,
      message,
      data,
      path,
      timestamp: getTimestamp(),
    };
  }

  static paginate<T>(
    data: T[],
    meta: Omit<PaginationResult<T>, 'data'>,
    path: string,
    message: string = 'List fetched successfully',
  ): ApiResponseBody<T[]> {
    return {
      success: true,
      message,
      data,
      path,
      timestamp: getTimestamp(),
      meta,
    };
  }

  static error(
    path: string,
    message: string = 'Operation failed',
  ): ApiResponseBody<null> {
    return {
      success: false,
      message,
      data: null,
      timestamp: getTimestamp(),
      path,
    };
  }
}

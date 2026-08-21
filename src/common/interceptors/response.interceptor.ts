import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponseBody, ApiResult } from '../response/api-result';
import { Request } from 'express';
import { PaginationResult } from '../database/pagination.types';

@Injectable()
export class ResponseIntercepter<T> implements NestInterceptor<
  T,
  ApiResponseBody<T> | ApiResponseBody<T[]>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseBody<T> | ApiResponseBody<T[]>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: unknown) => {
        const isObject = data !== null && typeof data === 'object';
        const responseData = isObject
          ? (data as Record<string, unknown>)
          : null;

        const hasMeta =
          responseData !== null && responseData.meta !== undefined;
        const hasMessage =
          responseData !== null && responseData.message !== undefined;

        let actualData = data;

        if (hasMeta || hasMessage) {
          actualData =
            responseData?.data !== undefined ? responseData.data : data;
        }

        const message = responseData
          ? (responseData.message as string | undefined)
          : undefined;

        return hasMeta
          ? ApiResult.paginate(
              actualData as T[],
              responseData.meta as Omit<PaginationResult<T>, 'data'>,
              request.url,
              message,
            )
          : ApiResult.success(actualData as T, request.url, message);
      }),
    );
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ApiResult } from '../response/api-result';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapter: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapter;

    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const resObj = response as Record<string, unknown>;

        if (Array.isArray(resObj.message)) {
          message = resObj.message[0] as string;
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        }
      } else if (typeof response === 'string') {
        message = response;
      }
    } else {
      const trace =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(
        `Unhandled exception: ${request.method} ${request.url}`,
        trace,
      );
    }

    const responseBody = ApiResult.error(request.url, message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

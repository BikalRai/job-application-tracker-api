import { QueryFailedError } from 'typeorm';

export const RETRYABLE_POSTGRES_ERROR_CODES = new Set([
  '40001', // serialization_failure
  '40P01', // deadlock_detected
]);

export const MAX_RETRIES = 3;

export interface PostgresQueryFailedError extends QueryFailedError<Error> {
  code: string;
}

export function isPostgresErrorCode(
  error: unknown,
): error is PostgresQueryFailedError {
  return (
    error instanceof QueryFailedError &&
    typeof (error as PostgresQueryFailedError).code === 'string'
  );
}

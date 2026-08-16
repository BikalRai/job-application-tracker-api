import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import {
  isPostgresErrorCode,
  MAX_RETRIES,
  RETRYABLE_POSTGRES_ERROR_CODES,
} from './transaction.types';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run<T>(
    work: (manager: EntityManager) => Promise<T>,
    manager?: EntityManager,
  ): Promise<T> {
    // if transaction exists, reuse it, do not nest new one
    if (manager?.queryRunner?.isTransactionActive) {
      return work(manager);
    }

    return this.runWithRetry(work);
  }

  private async runWithRetry<T>(
    work: (manager: EntityManager) => Promise<T>,
    attempt = 1,
  ): Promise<T> {
    try {
      return await this.dataSource.transaction(async (tx) => {
        return await work(tx);
      });
    } catch (error) {
      if (this.isRetryable(error) && attempt < MAX_RETRIES) {
        this.logger.warn(
          `Transaction conflict, retrying (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );

        return this.runWithRetry(work, attempt + 1);
      }
      this.logger.error('Transaction failed and was rolled back', error);
      throw error;
    }
  }

  private isRetryable(error: unknown): boolean {
    return (
      isPostgresErrorCode(error) &&
      RETRYABLE_POSTGRES_ERROR_CODES.has(error.code)
    );
  }
}

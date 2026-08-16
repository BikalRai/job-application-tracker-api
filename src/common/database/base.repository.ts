import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  PaginationOptions,
  PaginationResult,
} from './pagination.types';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  // method to find one or throw not found exception (404)
  async findOneOrThrow(where: FindOptionsWhere<T>): Promise<T> {
    const record = await this.findOne({
      where,
    });

    if (!record) {
      throw new NotFoundException('Record not found.');
    }

    return record;
  }

  //method to find all without pagination
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.find(options);
  }

  // method to create one, create new row in table
  async createOne(data: DeepPartial<T>): Promise<T> {
    const record = this.create(data);
    return await this.save(record);
  }

  // method to find one and update using merge
  async updateOne(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const record = await this.findOneOrThrow(where);

    const updated = this.merge(record, data);

    return await this.save(updated);
  }

  // get list of records with pagination
  async paginate(
    options: PaginationOptions<T> = {},
  ): Promise<PaginationResult<T>> {
    const page = options.page ?? DEFAULT_PER_PAGE;
    const perPage = Math.min(options.perPage ?? DEFAULT_PER_PAGE, MAX_PER_PAGE);

    const [data, total] = await this.findAndCount({
      where: options.where,
      relations: options.relations,
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return {
      data,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  // permanently remove the row from the table
  async deleteone(where: FindOptionsWhere<T>): Promise<void> {
    const record = await this.findOneOrThrow(where);

    await this.remove(record);
  }

  // marks a row as deleted without removing from the DB and does not show when queried
  // works with @DeleteDateColumn() in entity fields
  async softDeleteOne(where: FindOptionsWhere<T>): Promise<void> {
    await this.findOneOrThrow(where);

    await this.softDelete(where);
  }
}

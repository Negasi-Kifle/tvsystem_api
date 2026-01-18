// Legacy MongoDB base repository
// Note: This file is kept for reference but multi-tenancy has been removed.
// The system is now single-tenant and uses PostgreSQL (Prisma) as the primary database.

import { FilterQuery, Model, UpdateQuery } from 'mongoose';

/**
 * @deprecated Use Prisma repositories instead. This is kept for legacy MongoDB reference.
 */
export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).lean<T>().exec();
  }

  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter).lean<T[]>().exec();
  }

  async create(data: T): Promise<T> {
    return this.model.create(data);
  }

  async update(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true })
      .lean<T>()
      .exec();
  }

  async delete(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteOne(filter).exec();
  }
}

import { QueryOptions } from '../interfaces/query-options.interface';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(query: QueryOptions<T>): Promise<T[]>;
  count(filters?: Partial<T>): Promise<number>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(entity: T): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
}

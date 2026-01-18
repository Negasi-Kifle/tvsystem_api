export interface BaseRepositoryInterface<T> {
  findOne(filter: Partial<T>): Promise<T | null>;
  findMany(filter: Partial<T>): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(filter: Partial<T>, update: Partial<T>): Promise<T | null>;
  delete(filter: Partial<T>): Promise<void>;
}

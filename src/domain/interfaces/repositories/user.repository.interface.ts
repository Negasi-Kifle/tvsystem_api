import { User } from '../../entities/user.entity';
import { UserFilter } from '../../../infrastructure/database/prisma/repositories/user.repository';

export interface UserRepositoryInterface {
  findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<User | null>;
  findByMultipleFields(fields: Partial<User>): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  updateById(id: string, update: Partial<User>): Promise<User | null>;
  findMany(query: { skip: number, take: number }): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<User | null>;
  count(filters?: UserFilter): Promise<number>;
}

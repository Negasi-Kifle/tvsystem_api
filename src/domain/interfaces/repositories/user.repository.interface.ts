import { User } from '../../entities/user.entity';

export interface UserRepositoryInterface {
  findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<User | null>;
  findByMultipleFields(fields: Partial<User>): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  updateById(id: string, update: Partial<User>): Promise<User | null>;
  findMany(query: { skip: number, take: number }): Promise<User[]>;
  findById(id: string): Promise<User | null>;
}

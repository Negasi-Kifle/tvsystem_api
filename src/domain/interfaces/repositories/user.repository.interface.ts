import { User } from '../../entities/user.entity';

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  updateById(id: string, update: Partial<User>): Promise<User | null>;
}

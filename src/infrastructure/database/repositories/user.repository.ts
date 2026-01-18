import { UserRepositoryInterface } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as Partial<User>);
  }

  override async create(user: Omit<User, 'id'>): Promise<User> {
    return super.create(user as unknown as User);
  }

  async updateById(id: string, update: Partial<User>): Promise<User | null> {
    return super.update({ _id: id } as Partial<User>, update);
  }
}

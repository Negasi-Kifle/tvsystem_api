import { UserRepositoryInterface } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserModel } from '../mongodb-models/user.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
  constructor() {
    super(UserModel);
  }

  async findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<User | null> {
    return this.findOne({ OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] } as Partial<User>);
  }

  async findByMultipleFields(fields: Partial<User>): Promise<User | null> {
    return this.findOne(fields as Partial<User>);
  }

  override async create(user: Omit<User, 'id'>): Promise<User> {
    return super.create(user as unknown as User);
  }

  async updateById(id: string, update: Partial<User>): Promise<User | null> {
    return super.update({ _id: id } as Partial<User>, update);
  }
}

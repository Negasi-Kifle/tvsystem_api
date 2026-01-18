import { UserRepositoryInterface } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { TenantContext } from '../../../shared/types/tenant-context.type';
import { UserModel } from '../models/user.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string, ctx: TenantContext): Promise<User | null> {
    return this.findOne({ email } as Partial<User>, ctx);
  }

  async create(user: Omit<User, 'id'>, ctx: TenantContext): Promise<User> {
    return super.create(user as unknown as Omit<User, 'tenantId'>, ctx);
  }

  async updateById(id: string, update: Partial<User>, ctx: TenantContext): Promise<User | null> {
    return super.update({ _id: id } as Partial<User>, update, ctx);
  }
}

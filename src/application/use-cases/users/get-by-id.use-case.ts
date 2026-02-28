import { UserEntity } from '../../../domain/entities/user.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IUserRepository } from '../../../domain/repositories/user.repo';

export class GetByIdUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new EntityNotFoundError('User not found', 'User', id);
    }
    return user;
  }
}
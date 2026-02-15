import { UserEntity } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repo';

export class GetByIdUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
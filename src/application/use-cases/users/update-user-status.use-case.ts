import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UpdateUserStatusUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(id: string, isActive: boolean): Promise<UserEntity | null> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new EntityNotFoundError('User not found', 'User', id);
    }

    if (user.isFirstTimeAccount && isActive === false) {
      throw new ValidationError('First time account could not be deactivated');
    }
    
    
   const updatedUser = user.updateInstance(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      isActive,
      undefined,
      undefined,
      undefined,
      undefined);

    return this.userRepo.updateStatusWithParentSync(updatedUser);
  }
}

import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { IHashService } from '../../../domain/services/hash-service.service';
import { UserEntity } from '../../../domain/entities/user.entity';
import { sha256Hex } from '../../../shared/utils/secure-token';

export class CompletePasswordResetUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(plainToken: string, newPassword: string): Promise<UserEntity> {
    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    const tokenHash = sha256Hex(plainToken);
    const user = await this.userRepo.findByPasswordResetTokenHash(tokenHash);
    if (!user?.id) {
      throw new ValidationError('Invalid or expired reset token');
    }

    if (!user.passwordResetExpiresAt || user.passwordResetExpiresAt.getTime() < Date.now()) {
      throw new ValidationError('Reset token has expired');
    }

    const passwordHash = await this.hashService.hash(newPassword);
    const updated = await this.userRepo.updatePasswordAndClearResetToken(user.id, passwordHash);
    if (!updated) {
      throw new EntityNotFoundError('User not found', 'User', user.id);
    }
    return updated;
  }
}

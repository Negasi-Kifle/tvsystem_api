import { UserEntity } from '../entities/user.entity';
import { UserFilters } from '../interfaces/user-filters.interface';
import { IBaseRepository } from './base.repository.interface';
import { QueryOptions } from '../interfaces/query-options.interface';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findMany(query: QueryOptions<UserEntity, UserFilters>): Promise<UserEntity[]>;
  findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<UserEntity | null>;
  updatePassword(userId: string, passwordHash: string): Promise<UserEntity | null>;
  updatePasswordAndClearResetToken(userId: string, passwordHash: string): Promise<UserEntity | null>;
  findByPasswordResetTokenHash(tokenHash: string): Promise<UserEntity | null>;
  updatePasswordResetToken(
    userId: string,
    tokenHash: string | null,
    expiresAt: Date | null,
  ): Promise<UserEntity | null>;
  updateStatusWithParentSync(userEntity: UserEntity): Promise<UserEntity | null>;
  createUserWithPermissions(
    userEntity: UserEntity,
    permissionIds: string[],
    grantedBy?: string,
  ): Promise<UserEntity>;
}

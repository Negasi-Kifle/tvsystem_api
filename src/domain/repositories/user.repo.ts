import { UserEntity } from '../entities/user.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<UserEntity | null>;
  updatePassword(userId: string, passwordHash: string): Promise<UserEntity | null>;
  updateStatusWithParentSync(userEntity: UserEntity): Promise<UserEntity | null>;
}

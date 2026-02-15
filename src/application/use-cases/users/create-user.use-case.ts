import { UserEntity } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { SexTypes } from '../../../domain/enums/sex-types.enum';
import { UserRole } from '../../../domain/enums/user-role.enum';

/** Data-only input for creating a user (no class methods). */
export type CreateUserInput = {
  fullName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  sex: SexTypes;
  roles: UserRole[];
  isActive?: boolean;
  isFirstTimeAccount?: boolean;
  telegramUsername?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(payload: CreateUserInput): Promise<UserEntity> {
    const userEntity = UserEntity.createInstance(
      payload.fullName,
      payload.email,
      payload.passwordHash,
      payload.phoneNumber,
      payload.sex,
      payload.roles,
      payload.isActive ?? true,
      payload.isFirstTimeAccount ?? false,
      payload.telegramUsername,
      payload.createdAt,
      payload.updatedAt
    );

    // Check email
    const [existingUserByEmail, existingUserByPhoneNumber, firstTimeAccExists] = await Promise.all([
      this.userRepo.findByEmailOrPhoneNumber(userEntity.email),
      this.userRepo.findByEmailOrPhoneNumber(userEntity.phoneNumber),
      this.userRepo.findMany({ filters: { isFirstTimeAccount: true, isActive: true } })
    ]);

    if (existingUserByEmail || existingUserByPhoneNumber) {
      const errorMessage = existingUserByEmail ? 'Email already taken' : 'Phone number already taken';
      throw new Error(errorMessage);
    }

    if (firstTimeAccExists.length > 0) {
      throw new Error('First time account already exists');
    }

    return await this.userRepo.create(userEntity);

  }
}
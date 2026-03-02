import { UserEntity } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { IPartnerRepository } from '../../../domain/repositories/partner.repo';
import { IEmployeeRepository } from '../../../domain/repositories/employee.repo';
import { SexTypes } from '../../../domain/enums/sex-types.enum';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserRefModel } from '../../../domain/enums/user-ref-model.enum';
import { ValidationError } from '../../../domain/errors';

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
  refModel?: UserRefModel;
  telegramUsername?: string;
  partnerId?: string;
  employeeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly partnerRepo: IPartnerRepository,
    private readonly employeeRepo: IEmployeeRepository,
  ) { }

  async execute(payload: CreateUserInput): Promise<UserEntity> {
    const refModel = payload.refModel ?? UserRefModel.Internal;

    if (refModel === UserRefModel.Partner) {
      if (!payload.partnerId) {
        throw new ValidationError('partnerId is required when refModel is Partner');
      }
      const partner = await this.partnerRepo.findById(payload.partnerId);
      if (!partner) {
        throw new ValidationError('Partner not found');
      }
    }
    if (refModel === UserRefModel.Employee) {
      if (!payload.employeeId) {
        throw new ValidationError('employeeId is required when refModel is Employee');
      }
      const employee = await this.employeeRepo.findById(payload.employeeId);
      if (!employee) {
        throw new ValidationError('Employee not found');
      }
    }
    if (refModel === UserRefModel.Internal && (payload.partnerId || payload.employeeId)) {
      throw new ValidationError('partnerId and employeeId must not be set when refModel is Internal');
    }

    const userEntity = UserEntity.createInstance(
      payload.fullName,
      payload.email,
      payload.passwordHash,
      payload.phoneNumber,
      payload.sex,
      payload.roles,
      payload.isActive ?? true,
      payload.isFirstTimeAccount ?? false,
      refModel,
      payload.telegramUsername,
      payload.partnerId,
      payload.employeeId,
      payload.createdAt,
      payload.updatedAt
    );

    const [existingUserByEmail, existingUserByPhoneNumber, firstTimeAccExists] = await Promise.all([
      this.userRepo.findByEmailOrPhoneNumber(userEntity.email),
      this.userRepo.findByEmailOrPhoneNumber(userEntity.phoneNumber),
      this.userRepo.findMany({ filters: { isFirstTimeAccount: true, isActive: true } })
    ]);

    if (existingUserByEmail || existingUserByPhoneNumber) {
      const errorMessage = existingUserByEmail ? 'Email already taken' : 'Phone number already taken';
      throw new ValidationError(errorMessage);
    }

    if (firstTimeAccExists.length > 0 && payload.isFirstTimeAccount) {
      throw new ValidationError('First time account already exists');
    }

    return await this.userRepo.create(userEntity);
  }
}
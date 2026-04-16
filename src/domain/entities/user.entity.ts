import { UserRole, SexTypes, UserRefModel } from '../enums';
import { SalesCommissionType } from '../enums/sales-commission-type.enum';
import { ValidationError } from '../errors/validation.error';
import { EmployeeEntity } from './employee.entity';
import { PartnerEntity } from './partner.entity';


export class UserEntity {
  constructor(
    public fullName: string,
    public email: string,
    public passwordHash: string,
    public phoneNumber: string,
    public sex: SexTypes,
    public roles: UserRole[],
    public isActive: boolean = true,
    public isFirstTimeAccount: boolean,
    public refModel: UserRefModel,
    public telegramUsername?: string,
    public partnerId?: string,
    public employeeId?: string,
    public salesCommissionType?: SalesCommissionType,
    public salesCommissionAmount?: number,
    public passwordResetTokenHash?: string | null,
    public passwordResetExpiresAt?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public employee?: EmployeeEntity,
    public partner?: PartnerEntity,
  ) { }


  public static createInstance(
    fullName: string,
    email: string,
    passwordHash: string,
    phoneNumber: string,
    sex: SexTypes,
    roles: UserRole[],
    isActive: boolean,
    isFirstTimeAccount: boolean,
    refModel: UserRefModel = UserRefModel.Internal,
    telegramUsername?: string,
    partnerId?: string,
    employeeId?: string,
    salesCommissionType?: SalesCommissionType,
    salesCommissionAmount?: number,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    employee?: EmployeeEntity,
    partner?: PartnerEntity,
  ): UserEntity {

    if (!email.includes('@')) {
      throw new ValidationError('Email must be a valid email address');
    }

    if (phoneNumber.length !== 10) {
      throw new ValidationError('Phone number is required and must be only 10 characters long');
    }

    if (!fullName || fullName.trim().length < 2) {
      throw new ValidationError('Full name is required and must be at least 2 characters long');
    }

    if (roles.length === 0) {
      throw new ValidationError('Roles are required');
    }

    if(refModel == UserRefModel.Partner && !partnerId) {
      throw new ValidationError('partnerId is required when refModel is Partner');
    }
    if(refModel == UserRefModel.Employee && !employeeId) {
      throw new ValidationError('employeeId is required when refModel is Employee');
    }
    if (refModel == UserRefModel.Internal && (partnerId || employeeId)) {
      throw new ValidationError('partnerId and employeeId must not be set when refModel is Internal');
    }


    createdAt = createdAt ?? new Date();
    updatedAt = updatedAt ?? new Date();
    return new UserEntity(
      fullName,
      email,
      passwordHash,
      phoneNumber,
      sex,
      roles,
      isActive,
      isFirstTimeAccount,
      refModel,
      telegramUsername,
      partnerId,
      employeeId,
      salesCommissionType,
      salesCommissionAmount,
      null,
      null,
      createdAt,
      updatedAt,
      id,
      employee,
      partner);
  }

  public updateInstance(
    fullName?: string,
    email?: string,
    passwordHash?: string,
    phoneNumber?: string,
    sex?: SexTypes,
    roles?: UserRole[],
    isActive?: boolean,
    isFirstTimeAccount?: boolean,
    telegramUsername?: string,
    partnerId?: string,
    employeeId?: string,
    salesCommissionType?: SalesCommissionType,
    salesCommissionAmount?: number,
): UserEntity {
    if (fullName !== undefined) this.fullName = fullName;
    if (email !== undefined) this.email = email;
    if (passwordHash !== undefined) this.passwordHash = passwordHash;
    if (phoneNumber !== undefined) this.phoneNumber = phoneNumber;
    if (sex !== undefined) this.sex = sex;
    if (roles !== undefined) this.roles = roles;
    if (isActive !== undefined) this.isActive = isActive;
    if (isFirstTimeAccount !== undefined) this.isFirstTimeAccount = isFirstTimeAccount;
    if (telegramUsername !== undefined) this.telegramUsername = telegramUsername;
    if (partnerId !== undefined) this.partnerId = partnerId;
    if (employeeId !== undefined) this.employeeId = employeeId;
    if (salesCommissionType !== undefined) this.salesCommissionType = salesCommissionType;
    if (salesCommissionAmount !== undefined) this.salesCommissionAmount = salesCommissionAmount;
    
    this.updatedAt = new Date();
    return this;
  }
}

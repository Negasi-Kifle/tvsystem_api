import { UserRole } from '../enums/user-role.enum';
import { SexTypes } from '../enums/sex-types.enum';


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
    public telegramUsername?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) { }


  public static createInstance(
    fullName: string, email: string, passwordHash: string,
    phoneNumber: string, sex: SexTypes, roles: UserRole[],
    isActive: boolean, isFirstTimeAccount: boolean,
    telegramUsername?: string, createdAt?: Date, updatedAt?: Date, id?: string): UserEntity {

    if (!email.includes('@')) {
      throw new Error('Email must be a valid email address');
    }

    if (phoneNumber.length !== 10) {
      throw new Error('Phone number is required and must be only 10 characters long');
    }

    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Full name is required and must be at least 2 characters long');
    }

    if (roles.length === 0) {
      throw new Error('Roles are required');
    }


    createdAt = createdAt ?? new Date();
    updatedAt = updatedAt ?? new Date();
    return new UserEntity(fullName, email, passwordHash, phoneNumber, sex, roles, isActive, isFirstTimeAccount, telegramUsername, createdAt, updatedAt, id);
  }

  public updateInstance(fullName?: string, email?: string, passwordHash?: string, phoneNumber?: string, sex?: SexTypes, roles?: UserRole[], isActive?: boolean, isFirstTimeAccount?: boolean, telegramUsername?: string): UserEntity {
    if (fullName !== undefined) this.fullName = fullName;
    if (email !== undefined) this.email = email;
    if (passwordHash !== undefined) this.passwordHash = passwordHash;
    if (phoneNumber !== undefined) this.phoneNumber = phoneNumber;
    if (sex !== undefined) this.sex = sex;
    if (roles !== undefined) this.roles = roles;
    if (isActive !== undefined) this.isActive = isActive;
    if (isFirstTimeAccount !== undefined) this.isFirstTimeAccount = isFirstTimeAccount;
    if (telegramUsername !== undefined) this.telegramUsername = telegramUsername;

    this.updatedAt = new Date();
    return this;
  }
}

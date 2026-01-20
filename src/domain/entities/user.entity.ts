import { UserRole } from '../enums/user-role.enum';
import { SexTypes } from '../enums/sex-types.enum';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  sex: SexTypes.Male | SexTypes.Female;
  fullName: string;
  roles: UserRole[];
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  isFirstTimeAccount: boolean;
  updatedAt: Date;
  telegramUsername?: string;
}

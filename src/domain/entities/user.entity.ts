import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  roles: UserRole[];
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
}

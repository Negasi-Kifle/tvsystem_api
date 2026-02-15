import { z } from 'zod';
import { UserRole } from '../../../../domain/enums/user-role.enum';
import { SexTypes } from '../../../../domain/enums/sex-types.enum';

export const createUserDto = z.object({
  fullName: z.string("Full name is required and must be at least 2 characters long").min(2),
  email: z.string("Email is required and must be a valid email address").email(),
  passwordHash: z.string("Password is required and must be at least 6 characters long").min(6).optional().default(process.env.DEFAULT_PASSWORD || '123456'),
  phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, "Phone number must be only 10 characters long"),
  sex: z.enum(SexTypes, "Sex must be either Male or Female"),
  roles: z.array(z.enum(UserRole, "Roles must be a valid user role")),
  isActive: z.boolean("Is active must be a boolean").default(true),
  isFirstTimeAccount: z.boolean("Is first time account must be a boolean").default(false),
  telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
});

export type CreateUserDto = z.infer<typeof createUserDto>;

import { z } from 'zod';
import { SexTypes } from '../../../../domain/enums/sex-types.enum';
import { UserRole } from '../../../../domain/enums/user-role.enum';

export const registerDto = z.object({
  email: z.string("Email is required and must be a valid email address").email(),
  passwordHash: z.string("Password is required and must be at least 6 characters long").min(6),
  fullName: z.string("Full name is required and must be at least 2 characters long").min(2),
  phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, { message: "Phone number must be only 10 characters long" }),
  sex: z.enum(SexTypes, "Sex is required and must be either Male or Female"),
  roles: z.array(z.enum(UserRole, "Roles must be a valid user role")),
  telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
  isFirstTimeAccount: z.boolean("Is first time account must be a boolean").default(true),
});

export type RegisterDto = z.infer<typeof registerDto>;

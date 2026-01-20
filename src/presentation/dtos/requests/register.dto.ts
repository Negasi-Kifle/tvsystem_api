import { z } from 'zod';
import { SexTypes } from '../../../domain/enums/sex-types.enum';

export const registerDto = z.object({
  email: z.string("Email is required and must be a valid email address").email(),
  password: z.string("Password is required and must be at least 6 characters long").min(6),
  fullName: z.string("Full name is required and must be at least 2 characters long").min(2),
  phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, { message: "Phone number must be only 10 characters long" }),
  sex: z.enum(SexTypes, "Sex is required and must be either Male or Female"),
  telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
});

export type RegisterDto = z.infer<typeof registerDto>;

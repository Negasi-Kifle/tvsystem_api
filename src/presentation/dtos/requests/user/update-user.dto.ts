import { z } from "zod";
import { UserRole } from "../../../../domain/enums/user-role.enum";
import { SexTypes } from "../../../../domain/enums/sex-types.enum";

export const updateUserDto = z.object({
    email: z.string("Email is required and must be a valid email address").email().optional(),
    fullName: z.string("Full name is required and must be at least 2 characters long").min(2).optional(),
    phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, "Phone number must be only 10 characters long").optional(),
    sex: z.enum(SexTypes, "Sex must be either Male or Female").optional(),
    roles: z.array(z.enum(UserRole, "Roles must be a valid user role")).optional(),
    isActive: z.boolean("Is active must be a boolean").optional(),
    isFirstTimeAccount: z.boolean("Is first time account must be a boolean").optional(),
    telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
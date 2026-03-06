import { z } from "zod";
import { SexTypes } from "../../../../domain/enums/sex-types.enum";
import { UserRole } from "../../../../domain/enums/user-role.enum";


export const createPartnerDto = z.object({
    fullName: z.string("Full name is required and must be at least 2 characters long").min(2),
    email: z.email("Email is required and must be a valid email address"),
    passwordHash: z.string("Password is required and must be at least 6 characters long").min(6).optional().default(process.env.DEFAULT_PASSWORD || '123456'),
    phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, "Phone number must be only 10 characters long"),
    sex: z.enum(SexTypes, "Sex must be either Male or Female"),
    revenueShare: z.number("Revenue share is required and must be a number").min(0).max(100),
    roles: z.array(z.enum(UserRole, "Roles must be a valid user role")).optional().default([UserRole.Partner]),
    telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
    permissionIds: z.array(z.uuid("Each permission ID must be a valid UUID")).default([]),
})
    .strict()
    .refine(
        (data) => data.revenueShare >= 0 && data.revenueShare <= 100,
        { message: "Revenue share must be between 0 and 100" }
    );

export type CreatePartnerDto = z.infer<typeof createPartnerDto>;
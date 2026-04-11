import { z } from "zod";
import { SexTypes } from "../../../../domain/enums/sex-types.enum";
import { UserRole } from "../../../../domain/enums/user-role.enum";
import { SalesCommissionType } from "../../../../domain/enums/sales-commission-type.enum";


export const createPartnerDto = z.object({
    fullName: z.string("Full name is required and must be at least 2 characters long").min(2),
    email: z.email("Email is required and must be a valid email address"),
    passwordHash: z.string("Password is required and must be at least 6 characters long").min(6).optional().default(process.env.DEFAULT_PASSWORD || '123456'),
    phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, "Phone number must be only 10 characters long"),
    sex: z.enum(SexTypes, "Sex must be either Male or Female"),
    roles: z.array(z.enum(UserRole, "Roles must be a valid user role")).optional().default([UserRole.Partner]),
    telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
    permissionIds: z.array(z.uuid("Each permission ID must be a valid UUID")).default([]),
    salesCommissionType: z.enum(SalesCommissionType, "Sales commission type must be one of: " + Object.values(SalesCommissionType).join(", ")).optional(),
    salesCommissionAmount: z.coerce.number().min(0, "Sales commission amount must be greater than 0").optional(),
})
    .strict();

export type CreatePartnerDto = z.infer<typeof createPartnerDto>;
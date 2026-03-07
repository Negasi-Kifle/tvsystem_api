import { z } from 'zod';
import { UserRole } from '../../../../domain/enums/user-role.enum';
import { UserRefModel } from '../../../../domain/enums/user-ref-model.enum';
import { SexTypes } from '../../../../domain/enums/sex-types.enum';

const userRefModelValues = [UserRefModel.Partner, UserRefModel.Employee, UserRefModel.Internal] as const;

export const createUserDto = z
  .object({
    fullName: z.string("Full name is required and must be at least 2 characters long").min(2),
    email: z.string("Email is required and must be a valid email address").email(),
    passwordHash: z.string("Password is required and must be at least 6 characters long").min(6).optional().default(process.env.DEFAULT_PASSWORD || '123456'),
    phoneNumber: z.string("Phone number is required and must be only 10 characters long").min(10, "Phone number must be only 10 characters long"),
    sex: z.enum(SexTypes, "Sex must be either Male or Female"),
    roles: z.array(z.enum(UserRole, "Roles must be a valid user role")),
    isActive: z.boolean("Is active must be a boolean").default(true),
    isFirstTimeAccount: z.boolean("Is first time account must be a boolean").default(false),
    refModel: z.enum(userRefModelValues, "Ref model must be one of the following: " + userRefModelValues.join(", ")).optional(),
    telegramUsername: z.string("Telegram username is required and must be a valid telegram username").optional(),
    partnerId: z.uuid("Partner must be a valid UUID if refModel is Partner").optional(),
    employeeId: z.uuid("Employee must be a valid UUID if refModel is Employee").optional(),
    permissionIds: z.array(z.uuid("Each permission ID must be a valid UUID")).default([]),
  })
  .strict()
  .refine(
    (data) => {
      if (data.refModel === UserRefModel.Partner) return !!data.partnerId;
      return true;
    },
    { message: "partnerId is required when refModel is Partner. And employeeId must not be set" }
  )
  .refine(
    (data) => {
      if (data.refModel === UserRefModel.Employee) return !!data.employeeId;
      return true;
    },
    { message: "employeeId is required when refModel is Employee." }
  )
  // .refine(
  //   (data) => {
  //     if (data.refModel === UserRefModel.Internal) return !data.partnerId && !data.employeeId;
  //     return true;
  //   },
  //   { message: "partnerId and employeeId must not be set when refModel is Internal" }
  // );

export type CreateUserDto = z.infer<typeof createUserDto>;

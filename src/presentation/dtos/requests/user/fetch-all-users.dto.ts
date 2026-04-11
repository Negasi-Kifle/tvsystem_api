import { z } from "zod";
import { SexTypes } from "../../../../domain/enums/sex-types.enum";
import { UserRole } from "../../../../domain/enums/user-role.enum";
import { SalesCommissionType } from "../../../../domain/enums/sales-commission-type.enum";

// Transform string "true"/"false" to boolean
const stringToBoolean = z.string().transform((val) => val === "true").optional();

export const fetchAllUsersDto = z.object({
  // Pagination
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),

  // Filters
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  roles: z.nativeEnum(UserRole).optional(),
  isActive: stringToBoolean,
  sex: z.enum(SexTypes).optional(),
  isFirstTimeAccount: stringToBoolean,
  salesCommissionType: z.enum(SalesCommissionType, "Sales commission type must be one of: " + Object.values(SalesCommissionType).join(", ")).optional(),
}).strict();

export type FetchAllUsersDto = z.infer<typeof fetchAllUsersDto>;
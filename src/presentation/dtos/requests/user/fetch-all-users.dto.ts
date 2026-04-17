import { z } from "zod";
import { SexTypes } from "../../../../domain/enums/sex-types.enum";
import { UserRole } from "../../../../domain/enums/user-role.enum";
import { SalesCommissionType } from "../../../../domain/enums/sales-commission-type.enum";

// Transform string "true"/"false" to boolean
const stringToBoolean = z.string().transform((val) => val === "true").optional();

/**
 * Express sets `roles` to a string for one value and to string[] for repeated keys.
 * Also accept comma-separated values in a single param: `roles=Host,Partner`.
 */
function normalizeRolesQuery(value: unknown): unknown {
  if (value === undefined || value === "") return undefined;
  const segments: string[] = [];
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") {
        segments.push(
          ...item.split(",").map((s) => s.trim()).filter(Boolean),
        );
      }
    }
  } else if (typeof value === "string") {
    segments.push(...value.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return segments.length > 0 ? segments : undefined;
}

export const fetchAllUsersDto = z.object({
  // Pagination
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),

  // Filters
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  roles: z.preprocess(
    normalizeRolesQuery,
    z.array(z.enum(UserRole)).optional(),
  ),
  isActive: stringToBoolean,
  sex: z.enum(SexTypes).optional(),
  isFirstTimeAccount: stringToBoolean,
  salesCommissionType: z.enum(SalesCommissionType, "Sales commission type must be one of: " + Object.values(SalesCommissionType).join(", ")).optional(),
}).strict();

export type FetchAllUsersDto = z.infer<typeof fetchAllUsersDto>;
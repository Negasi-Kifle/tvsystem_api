import { z } from "zod";
import { SalesCommissionType } from "../../../../domain/enums/sales-commission-type.enum";

export const fetchAllEmployeesDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    employeeNumber: z.string().optional(),
    department: z.string().optional(),
    isActive: z.boolean().optional(),
    salesCommissionType: z.nativeEnum(SalesCommissionType).optional(),
}).strict();

export type FetchAllEmployeesDto = z.infer<typeof fetchAllEmployeesDto>;
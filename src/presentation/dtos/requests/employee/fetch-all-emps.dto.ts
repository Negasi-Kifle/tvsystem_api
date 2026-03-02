import {z} from "zod";

export const fetchAllEmployeesDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    employeeNumber: z.string().optional(),
    department: z.string().optional(),
    isActive: z.boolean().optional(),
}).strict()

export type FetchAllEmployeesDto = z.infer<typeof fetchAllEmployeesDto>;
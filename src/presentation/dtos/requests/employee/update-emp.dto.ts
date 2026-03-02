import { z } from "zod";

export const updateEmployeeDto = z.object({
    employeeNumber: z.string().optional(),
    department: z.string().optional(),
})
    .strict();

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeDto>;
import { z } from "zod";



export const updateEmployeeStatusDto = z.object({
    isActive: z.boolean("Is active must be a boolean"),
}).strict();


export type UpdateEmployeeStatusDto = z.infer<typeof updateEmployeeStatusDto>;
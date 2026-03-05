import { z } from "zod";

export const updateUserStatusDto = z.object({
    isActive: z.boolean("Is active must be a boolean"),
}).strict();

export type UpdateUserStatusDto = z.infer<typeof updateUserStatusDto>;

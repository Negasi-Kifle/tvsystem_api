import { z } from "zod";

export const updatePermissionDto = z.object({
    name: z.string().min(2, "Permission name must be at least 2 characters long").optional(),
    description: z.string().optional(),
});

export type UpdatePermissionDto = z.infer<typeof updatePermissionDto>;
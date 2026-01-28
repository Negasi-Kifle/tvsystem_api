import { z } from "zod";

export const createPermissionDto = z.object({
    name: z.string("Permission name is required and must be at least 2 characters long").min(2, "Permission name must be at least 2 characters long"),
    description: z.string().optional(),
});

export type CreatePermissionDto = z.infer<typeof createPermissionDto>;
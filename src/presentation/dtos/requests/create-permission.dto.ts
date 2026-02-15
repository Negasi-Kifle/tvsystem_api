import { z } from "zod";

export const createPermissionDto = z.object({
    name: z.string("Permission name is required and must be at least 2 characters long").min(2, "Permission name must be at least 2 characters long"),
    nameSlug: z.string("Permission name slug is required and must be at least 2 characters long").min(2, "Permission name slug must be at least 2 characters long").optional(),
    isSystemPermission: z.boolean("Is system permission must be a boolean").optional().default(false),
    description: z.string("Description is required and must be at least 2 characters long").min(2, "Description must be at least 2 characters long").optional(),
});

export type CreatePermissionDto = z.infer<typeof createPermissionDto>;
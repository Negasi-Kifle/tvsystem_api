import { z } from "zod";

export const createUserPermissionDto = z.object({
    userId: z.uuid("User ID is required and must be a valid UUID"),
    permissionIds: z.array(
        z.uuid("Each permission ID must be a valid UUID"), "Permission IDs must be an array of valid UUIDs"
    ).min(1, "At least one permission ID is required"),
    grantedBy: z.uuid().optional(),
    expiresAt: z.date().optional(),
});

export type CreateUserPermissionDto = z.infer<typeof createUserPermissionDto>;
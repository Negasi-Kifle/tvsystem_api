import { z } from "zod";

export const createUserPermissionDto = z.object({
    userId: z.uuid("User ID is required and must be a valid UUID"),
    permissionId: z.uuid("Permission ID is required and must be a valid UUID"),
    expiresAt: z.date("Expires at must be a valid date").optional(),
});

export type CreateUserPermissionDto = z.infer<typeof createUserPermissionDto>;
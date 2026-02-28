import { z } from "zod";

export const fetchAllUserPermissionsDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    userId: z.string().optional(),
    permissionId: z.string().optional(),
    grantedBy: z.string().optional(),
    expiresAt: z.date().optional(),
});

export type FetchAllUserPermissionsDto = z.infer<typeof fetchAllUserPermissionsDto>;
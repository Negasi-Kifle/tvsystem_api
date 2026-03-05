import { z } from "zod";

export const fetchAllPermissionsDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    name: z.string().optional(),
    nameSlug: z.string().optional(),
    description: z.string().optional(),
    isSystemPermission: z.boolean().optional(),
});

export type FetchAllPermissionsDto = z.infer<typeof fetchAllPermissionsDto>;
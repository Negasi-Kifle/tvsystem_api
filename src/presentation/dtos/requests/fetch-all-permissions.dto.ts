import { z } from "zod";

export const fetchAllPermissionsDto = z.object({
    page: z.number().optional(),
    limit: z.coerce.number().int().positive().optional().default(10),
    name: z.string().optional(),
    nameSlug: z.string().optional(),
    description: z.string().optional(),
    isSystemPermission: z.boolean().optional(),
});

export type FetchAllPermissionsDto = z.infer<typeof fetchAllPermissionsDto>;
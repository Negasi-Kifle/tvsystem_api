import { z } from "zod";

export const updateMediaPackDto = z.object({
    version: z.string().min(1, "Version cannot be empty").optional(),
    versionSlug: z.string().min(1, "Version slug cannot be empty").optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
}).strict();

export type UpdateMediaPackDto = z.infer<typeof updateMediaPackDto>;

import { z } from "zod";

export const createMediaPackDto = z.object({
    version: z.string('Version is required').min(1, 'Version cannot be empty'),
    versionSlug: z.string('Version slug is required').min(1, 'Version slug cannot be empty').optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
}).strict();

export type CreateMediaPackDto = z.infer<typeof createMediaPackDto>;

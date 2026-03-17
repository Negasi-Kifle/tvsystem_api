import { z } from "zod";

const stringToBoolean = z.string().transform((val) => val === "true").optional();

export const fetchAllMediaPacksDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    isActive: stringToBoolean,
    versionSlug: z.string().optional(),
    version: z.string().optional(),
}).strict();

export type FetchAllMediaPacksDto = z.infer<typeof fetchAllMediaPacksDto>;

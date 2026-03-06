import { z } from "zod";

const stringToBoolean = z.string().transform((val) => val === "true").optional();

export const fetchAllPartnersDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    revenueShare: z.coerce.number().min(0).max(100).optional(),
    isActive: stringToBoolean,
}).strict();

export type FetchAllPartnersDto = z.infer<typeof fetchAllPartnersDto>;

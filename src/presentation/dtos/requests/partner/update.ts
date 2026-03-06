import { z } from "zod";

export const updatePartnerDto = z.object({
    revenueShare: z.number("Revenue share must be a number").min(0).max(100).optional(),
}).strict();

export type UpdatePartnerDto = z.infer<typeof updatePartnerDto>;

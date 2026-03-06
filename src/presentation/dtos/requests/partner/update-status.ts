import { z } from "zod";

export const updatePartnerStatusDto = z.object({
    isActive: z.boolean("Is active must be a boolean"),
}).strict();

export type UpdatePartnerStatusDto = z.infer<typeof updatePartnerStatusDto>;

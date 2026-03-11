import { z } from "zod";

export const updatePartnerDto = z.object({
    isActive: z.boolean("Is active must be a boolean"),
}).strict();

export type UpdatePartnerDto = z.infer<typeof updatePartnerDto>;

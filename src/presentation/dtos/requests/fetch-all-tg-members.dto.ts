import { z } from "zod";

export const fetchAllTgMembersDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    userId: z.string().optional(),
    telegramGroupId: z.string().optional(),
});

export type FetchAllTgMembersDto = z.infer<typeof fetchAllTgMembersDto>;
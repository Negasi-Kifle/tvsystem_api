import { z } from "zod";

export const fetchAllTgMembersDto = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    userId: z.string().optional(),
    telegramGroupId: z.string().optional(),
});

export type FetchAllTgMembersDto = z.infer<typeof fetchAllTgMembersDto>;
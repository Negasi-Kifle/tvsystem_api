import { z } from "zod";


export const fetchAllTgGroupsDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    groupName: z.string().optional(),
    groupChatId: z.string().optional(),
    groupLink: z.url("Group link must be a valid URL").optional(),
    isActive: z.boolean().optional()
});

export type FetchAllTgGroupsDto = z.infer<typeof fetchAllTgGroupsDto>;
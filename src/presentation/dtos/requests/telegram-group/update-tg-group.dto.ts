import { z } from "zod";

export const updateTelegramGroupDto = z.object({
    groupName: z.string().optional(),
    groupChatId: z.string().optional(),
    groupLink: z.url("Group link must be a valid URL").optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional()
});

export type UpdateTelegramGroupDto = z.infer<typeof updateTelegramGroupDto>;
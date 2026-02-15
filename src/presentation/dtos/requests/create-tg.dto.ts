import { z } from 'zod';

export const createTelegramGroupDto = z.object({
    groupName: z.string("Group name is required and must be at least 2 characters long").min(2),
    groupChatId: z.string().optional(),
    groupLink: z.url("Group link is required and must be a valid URL"),
    description: z.string().optional(),
    isActive: z.boolean().optional().default(true),
});

export type CreateTelegramGroupDto = z.infer<typeof createTelegramGroupDto>;
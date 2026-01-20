import { z } from "zod";

export const removeUserFromTelegramGroupDto = z.object({
    userId: z.string("User ID is required").min(1),
    telegramGroupId: z.string("Telegram Group ID is required").min(1)
});

export type RemoveUserFromTelegramGroupDto = z.infer<typeof removeUserFromTelegramGroupDto>;
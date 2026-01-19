import { z } from 'zod';

export const resetPasswordDto = z.object({
  id: z.uuid("ID is required and must be a valid UUID")
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
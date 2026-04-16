import { z } from 'zod';

export const resetPasswordByTokenDto = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordByTokenDto = z.infer<typeof resetPasswordByTokenDto>;

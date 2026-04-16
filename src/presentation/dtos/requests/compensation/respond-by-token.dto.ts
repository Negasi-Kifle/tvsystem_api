import { z } from 'zod';

export const respondCompensationByTokenDto = z.object({
  token: z.string().min(1, 'Token is required'),
  accept: z.boolean(),
  customerResponse: z.string().optional(),
});

export type RespondCompensationByTokenDto = z.infer<typeof respondCompensationByTokenDto>;

import { z } from 'zod';

export const registerDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2)
});

export type RegisterDto = z.infer<typeof registerDto>;

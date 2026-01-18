import { z } from 'zod';

export const compensationDto = z.object({
  advertId: z.string().min(1),
  proposal: z.string().min(3),
  customerEmail: z.string().email().optional()
});

export type CompensationDto = z.infer<typeof compensationDto>;

import { z } from 'zod';

export const createAdvertDto = z.object({
  showId: z.string().min(1),
  customerId: z.string().min(1),
  slot: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime()
    })
    .optional(),
  contractDetails: z.string().optional()
});

export type CreateAdvertDto = z.infer<typeof createAdvertDto>;

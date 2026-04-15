import { z } from 'zod';

export const updateShowSegmentSlotDto = z
  .object({
    showId: z.uuid("Show ID must be a valid UUID").optional(),
    customerId: z.uuid("Customer ID must be a valid UUID").optional(),
  })
  .strict();

export type UpdateShowSegmentSlotDto = z.infer<typeof updateShowSegmentSlotDto>;

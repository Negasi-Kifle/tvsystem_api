import { z } from 'zod';

export const createShowSegmentSlotDto = z.object({
  showId: z.uuid("Show Id must be a valid UUID"),
  customerId: z.uuid("Customer Id must be a valid UUID"),
});

export type CreateShowSegmentSlotDto = z.infer<typeof createShowSegmentSlotDto>;

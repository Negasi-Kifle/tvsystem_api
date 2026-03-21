import { z } from 'zod';

export const linkCustomerToShowSlotDto = z
  .object({
    customerId: z.string().uuid(),
    showSegmentSlotId: z.string().uuid(),
  })
  .strict();

export type LinkCustomerToShowSlotDto = z.infer<typeof linkCustomerToShowSlotDto>;

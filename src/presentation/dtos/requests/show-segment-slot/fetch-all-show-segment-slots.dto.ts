import { z } from 'zod';

export const fetchAllShowSegmentSlotsDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  showId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
});

export type FetchAllShowSegmentSlotsDto = z.infer<typeof fetchAllShowSegmentSlotsDto>;

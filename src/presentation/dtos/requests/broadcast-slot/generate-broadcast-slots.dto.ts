import { z } from 'zod';

export const generateBroadcastSlotsDto = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
}).refine(
  (data) => {
    if (data.fromDate != null && data.toDate != null) {
      return data.toDate > data.fromDate;
    }
    return true;
  },
  { message: 'toDate must be after fromDate', path: ['toDate'] },
);

export type GenerateBroadcastSlotsDto = z.infer<typeof generateBroadcastSlotsDto>;

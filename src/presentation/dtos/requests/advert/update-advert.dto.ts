import { z } from 'zod';
import { AdvertStatus } from '../../../../domain/enums/advert-status.enum';

export const updateAdvertDto = z
  .object({
    showId: z.uuid('Show ID must be a valid UUID').optional(),
    customerId: z.uuid('Customer ID must be a valid UUID').optional(),
    status: z
      .enum(AdvertStatus, `Status must be one of: ${Object.values(AdvertStatus).join(', ')}`)
      .optional(),
    slot: z
      .object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      })
      .optional()
      .nullable(),
    contractDetails: z.string().optional().nullable(),
    broadcastSlotId: z.uuid('Broadcast slot ID must be a valid UUID').optional().nullable(),
  })
  .strict();

export type UpdateAdvertDto = z.infer<typeof updateAdvertDto>;

import { z } from 'zod';
import { AdvertStatus } from '../../../../domain/enums/advert-status.enum';

export const createAdvertDto = z
  .object({
    showId: z.uuid('Show ID must be a valid UUID'),
    customerId: z.uuid('Customer ID must be a valid UUID'),
    status: z
      .enum(AdvertStatus, `Status must be one of: ${Object.values(AdvertStatus).join(', ')}`)
      .optional(),
    slot: z
      .object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      })
      .optional(),
    contractDetails: z.string().optional(),
    broadcastSlotId: z.uuid('Broadcast slot ID must be a valid UUID').optional().nullable(),
  })
  .strict();

export type CreateAdvertDto = z.infer<typeof createAdvertDto>;

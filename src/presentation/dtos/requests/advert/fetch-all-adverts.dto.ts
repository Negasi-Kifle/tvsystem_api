import { z } from 'zod';
import { AdvertStatus } from '../../../../domain/enums/advert-status.enum';

export const fetchAllAdvertsDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    showId: z.uuid().optional(),
    customerId: z.uuid().optional(),
    broadcastSlotId: z.uuid().optional(),
    status: z
      .enum(AdvertStatus, `Status must be one of: ${Object.values(AdvertStatus).join(', ')}`)
      .optional(),
  })
  .strict();

export type FetchAllAdvertsDto = z.infer<typeof fetchAllAdvertsDto>;

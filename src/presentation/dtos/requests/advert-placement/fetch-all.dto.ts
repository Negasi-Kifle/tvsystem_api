import { z } from 'zod';
import { AdvertPlacementStatus } from '../../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../../domain/enums/advert-position.enum';

export const fetchAllAdvertPlacementsDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    advertSalesId: z.uuid().optional(),
    showId: z.uuid().optional(),
    broadcastSlotId: z.uuid().optional(),
    status: z
      .enum(
        AdvertPlacementStatus,
        `Status must be one of: ${Object.values(AdvertPlacementStatus).join(', ')}`,
      )
      .optional(),
    position: z
      .enum(
        AdvertPosition,
        `Position must be one of: ${Object.values(AdvertPosition).join(', ')}`,
      )
      .optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    broadcastCode: z.string().optional()
  })
  .strict();

export type FetchAllAdvertPlacementsDto = z.infer<typeof fetchAllAdvertPlacementsDto>;

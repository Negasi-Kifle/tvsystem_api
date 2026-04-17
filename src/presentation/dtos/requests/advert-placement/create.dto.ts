import { z } from 'zod';
import { AdvertPlacementStatus } from '../../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../../domain/enums/advert-position.enum';

export const createAdvertPlacementDto = z
  .object({
    advertSalesId: z.uuid('Advert sales ID must be a valid UUID'),
    showId: z.uuid('Show ID must be a valid UUID'),
    date: z.coerce.date(),
    dateEth: z.string().min(1),
    position: z.enum(
      AdvertPosition,
      `Position must be one of: ${Object.values(AdvertPosition).join(', ')}`,
    ),
    durationSeconds: z.coerce.number().int().positive(),
    status: z
      .enum(
        AdvertPlacementStatus,
        `Status must be one of: ${Object.values(AdvertPlacementStatus).join(', ')}`,
      )
      .optional(),
    broadcastSlotId: z.uuid('Broadcast slot ID must be a valid UUID').optional(),
    spotIndex: z.coerce.number().int().positive().optional().default(1),
    plannedTimeMinutes: z.coerce.number().int().nonnegative().optional(),
  })
  .strict();

export type CreateAdvertPlacementDto = z.infer<typeof createAdvertPlacementDto>;

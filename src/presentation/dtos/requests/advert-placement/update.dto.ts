import { z } from 'zod';
import { AdvertPlacementStatus } from '../../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../../domain/enums/advert-position.enum';

export const updateAdvertPlacementDto = z
  .object({
    broadcastSlotId: z.uuid('Broadcast slot ID must be a valid UUID').nullable().optional(),
    position: z
      .enum(
        AdvertPosition,
        `Position must be one of: ${Object.values(AdvertPosition).join(', ')}`,
      )
      .optional(),
    spotIndex: z.coerce.number().int().positive().optional(),
    broadcastCode: z.string().min(1).nullable().optional(),
    plannedTimeMinutes: z.coerce.number().int().nonnegative().nullable().optional(),
    actualAirTime: z.coerce.date().nullable().optional(),
    durationSeconds: z.coerce.number().int().positive().optional(),
    status: z
      .enum(
        AdvertPlacementStatus,
        `Status must be one of: ${Object.values(AdvertPlacementStatus).join(', ')}`,
      )
      .optional(),
  })
  .strict();

export type UpdateAdvertPlacementDto = z.infer<typeof updateAdvertPlacementDto>;

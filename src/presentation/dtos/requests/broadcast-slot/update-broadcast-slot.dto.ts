import { z } from 'zod';
import { ETHIOPIAN_DAY_PART_VALUES } from '../../../../domain/value-objects/ethiopian-time.value-objects';
import { BroadcastSlotStatus } from '../../../../domain/enums/broadcast-slot-status.enum';

export const updateBroadcastSlotDto = z.object({
  status: z.enum(BroadcastSlotStatus, "Status must be one of : " + Object.values(BroadcastSlotStatus).join(', ')).optional(),
  hour: z.number().int().min(1).max(12).optional(),
  minute: z.number().int().min(0).max(59).optional(),
  dayPart: z.enum(ETHIOPIAN_DAY_PART_VALUES, "Day part must be one of : " + Object.values(ETHIOPIAN_DAY_PART_VALUES).join(', ')).optional(),
  durationMinutes: z.number().int().positive().optional(),
  label: z.string().nullable().optional(),
  overrideReason: z.string().nullable().optional(),
});

export type UpdateBroadcastSlotDto = z.infer<typeof updateBroadcastSlotDto>;

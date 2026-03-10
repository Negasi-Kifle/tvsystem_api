import { z } from 'zod';
import { ETHIOPIAN_DAY_PART_VALUES } from '../../../../domain/value-objects/ethiopian-time.value-objects';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

const blockItemSchema = z.object({
  showId: z.uuid(),
  dayOfWeek: z.enum(DayOfWeek, "Day of week must be one of the following: " + Object.values(DayOfWeek).join(', ')),
  hour: z.number().int().min(1).max(12),
  minute: z.number().int().min(0).max(59),
  dayPart: z.enum(ETHIOPIAN_DAY_PART_VALUES, "Day part must be one of the following: " + Object.values(ETHIOPIAN_DAY_PART_VALUES).join(', ')),
  broadcastType: z.enum(BroadcastType, "Broadcast type must be one of the following: " + Object.values(BroadcastType).join(', ')),
  label: z.string().optional(),
}).strict();

export const createBatchScheduleBlocksDto = z.object({
  blocks: z.array(blockItemSchema).min(1),
});

export type CreateBatchScheduleBlocksDto = z.infer<typeof createBatchScheduleBlocksDto>;

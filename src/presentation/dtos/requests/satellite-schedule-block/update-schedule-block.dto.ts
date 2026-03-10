import { z } from 'zod';
import { ETHIOPIAN_DAY_PART_VALUES } from '../../../../domain/value-objects/ethiopian-time.value-objects';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const updateScheduleBlockDto = z.object({
  showId: z.uuid().optional(),
  dayOfWeek: z.enum(DayOfWeek, "Day of week must be one of the following: " + Object.values(DayOfWeek).join(', ')).optional(),
  hour: z.number().int().min(1).max(12).optional(),
  minute: z.number().int().min(0).max(59).optional(),
  dayPart: z.enum(ETHIOPIAN_DAY_PART_VALUES, "Day part must be one of the following: " + Object.values(ETHIOPIAN_DAY_PART_VALUES).join(', ')).optional(),
  broadcastType: z.enum(BroadcastType, "Broadcast type must be one of the following: " + Object.values(BroadcastType).join(', ')).optional(),
  label: z.string().nullable().optional(),
}).strict();

export type UpdateScheduleBlockDto = z.infer<typeof updateScheduleBlockDto>;

import { z } from 'zod';
import { ETHIOPIAN_DAY_PART_VALUES } from '../../../../domain/value-objects/ethiopian-time.value-objects';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const updateScheduleBlockDto = z.object({
  showId: z.uuidv7().optional(),
  dayOfWeek: z.enum(DayOfWeek).optional(),
  hour: z.number().int().min(1).max(12).optional(),
  minute: z.number().int().min(0).max(59).optional(),
  dayPart: z.enum(ETHIOPIAN_DAY_PART_VALUES).optional(),
  durationMinutes: z.number().int().positive().optional(),
  broadcastType: z.enum(BroadcastType).optional(),
  label: z.string().nullable().optional(),
});

export type UpdateScheduleBlockDto = z.infer<typeof updateScheduleBlockDto>;

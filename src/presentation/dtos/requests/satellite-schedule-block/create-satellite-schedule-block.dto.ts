import { z } from 'zod';
import { ETHIOPIAN_DAY_PART_VALUES } from '../../../../domain/value-objects/ethiopian-time.value-objects';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const createScheduleBlockDto = z.object({
  showId: z.string().uuid(),
  dayOfWeek: z.enum(DayOfWeek),
  hour: z.number().int().min(1).max(12),
  minute: z.number().int().min(0).max(59),
  dayPart: z.enum(ETHIOPIAN_DAY_PART_VALUES),
  durationMinutes: z.number().int().positive().optional(),
  broadcastType: z.enum(BroadcastType),
  label: z.string().optional(),
});

export type CreateScheduleBlockDto = z.infer<typeof createScheduleBlockDto>;

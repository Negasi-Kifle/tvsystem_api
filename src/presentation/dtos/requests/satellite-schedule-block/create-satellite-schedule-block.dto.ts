import { z } from 'zod';
import { ETHIOPIAN_DAY_PART_VALUES } from '../../../../domain/value-objects/ethiopian-time.value-objects';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const createScheduleBlockDto = z
  .object({
    showId: z.uuid(),
    dayOfWeek: z.enum(DayOfWeek, "Day of week must be one of the following: " + Object.values(DayOfWeek).join(', ')),
    hour: z.number().int().min(0).max(23).optional(),
    hourEth: z.number().int().min(1).max(12).optional(),
    minute: z.number().int().min(0).max(59).optional().default(0),
    dayPart: z.enum(ETHIOPIAN_DAY_PART_VALUES, "Day part must be one of the following: " + Object.values(ETHIOPIAN_DAY_PART_VALUES).join(', ')).optional(),
    broadcastType: z.enum(BroadcastType, "Broadcast type must be one of the following: " + Object.values(BroadcastType).join(', ')),
    label: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => data.hour !== undefined || (data.hourEth !== undefined && data.dayPart !== undefined),
    { message: 'Either gregorian time (hour) or ethiopian time (hourEth) must be provided; both cannot be empty.' },
  )
  .refine(
    (data) => {
      const hasHourEth = data.hourEth !== undefined;
      const hasDayPart = data.dayPart !== undefined;
      return hasHourEth === hasDayPart;
    },
    { message: 'hourEth and dayPart must be provided together; if one is set, the other is required.' },
  );

export type CreateScheduleBlockDto = z.infer<typeof createScheduleBlockDto>;

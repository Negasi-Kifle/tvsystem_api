import { z } from 'zod';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const fetchScheduleBlocksDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(500).optional().default(200),
  dayOfWeek: z.enum(DayOfWeek).optional(),
  showId: z.string().uuid().optional(),
  broadcastType: z.enum(BroadcastType).optional(),
});

export type FetchScheduleBlocksDto = z.infer<typeof fetchScheduleBlocksDto>;

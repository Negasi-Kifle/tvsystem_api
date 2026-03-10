import { z } from 'zod';
import { BroadcastSlotStatus } from '../../../../domain/enums/broadcast-slot-status.enum';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const fetchBroadcastSlotsDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(500).optional().default(200),
  showId: z.string().uuid().optional(),
  dayOfWeek: z.nativeEnum(DayOfWeek).optional(),
  status: z.nativeEnum(BroadcastSlotStatus).optional(),
  broadcastType: z.nativeEnum(BroadcastType).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type FetchBroadcastSlotsDto = z.infer<typeof fetchBroadcastSlotsDto>;

import { z } from 'zod';
import { BroadcastSlotStatus } from '../../../../domain/enums/broadcast-slot-status.enum';
import { BroadcastType } from '../../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../../domain/enums/day-of-week.enum';

export const broadcastSlotGroupByKeys = ['showId', 'date', 'dateEth'] as const;
export type BroadcastSlotGroupBy = (typeof broadcastSlotGroupByKeys)[number];

export const fetchBroadcastSlotsDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(500).optional().default(200),
  showId: z.string().uuid().optional(),
  dayOfWeek: z.enum(DayOfWeek, "Day of week must be one of : " + Object.values(DayOfWeek).join(', ')).optional(),
  status: z.enum(BroadcastSlotStatus, "Status must be one of : " + Object.values(BroadcastSlotStatus).join(', ')).optional(),
  broadcastType: z.enum(BroadcastType, "Broadcast type must be one of : " + Object.values(BroadcastType).join(', ')).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  groupBy: z.enum(broadcastSlotGroupByKeys, "Group by must be one of : " + broadcastSlotGroupByKeys.join(', ')).optional(),
});

export type FetchBroadcastSlotsDto = z.infer<typeof fetchBroadcastSlotsDto>;

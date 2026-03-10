import { BroadcastSlotStatus, BroadcastType, DayOfWeek } from '../enums';

export type BroadcastSlotFilters = {
  scheduleId?: string;
  scheduleBlockId?: string;
  showId?: string;
  dayOfWeek?: DayOfWeek;
  status?: BroadcastSlotStatus;
  broadcastType?: BroadcastType;
  dateFrom?: Date;
  dateTo?: Date;
};

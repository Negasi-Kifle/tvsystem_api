import { BroadcastType, DayOfWeek } from '../enums';

export type ScheduleBlockFilters = {
  scheduleId?: string;
  showId?: string;
  dayOfWeek?: DayOfWeek;
  broadcastType?: BroadcastType;
};

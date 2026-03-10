import { Prisma } from '@prisma/client';
import { ScheduleBlockFilters } from '../../../domain/interfaces/schedule-block-filters.interface';

export function buildWhereClauseForScheduleBlock(
  filters: ScheduleBlockFilters,
): Prisma.SatelliteScheduleBlockWhereInput {
  if (!filters) return {};

  return {
    ...(filters.scheduleId && { scheduleId: filters.scheduleId }),
    ...(filters.showId && { showId: filters.showId }),
    ...(filters.dayOfWeek && { dayOfWeek: filters.dayOfWeek }),
    ...(filters.broadcastType && { broadcastType: filters.broadcastType }),
  };
}

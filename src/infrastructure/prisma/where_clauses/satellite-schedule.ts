import { SatelliteScheduleFilters } from '../../../domain/interfaces/satellite-schedule-filters.interface';
import { Prisma } from '../generated/client';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';

export function buildWhereClauseForSatelliteSchedule(
  filters: SatelliteScheduleFilters,
): Prisma.SatelliteScheduleWhereInput {
  if (!filters) return {};

  return {
    ...(filters.name && { name: { contains: filters.name, mode: 'insensitive' as Prisma.QueryMode } }),
    ...(filters.nameSlug && { nameSlug: filters.nameSlug }),
    ...(filters.status && { status: filters.status as SatelliteScheduleStatus }),
    ...(filters.scheduleType && { scheduleType: filters.scheduleType as SatelliteScheduleType }),
    ...(filters.effectiveFromAfter != null && { effectiveFrom: { gte: filters.effectiveFromAfter } }),
    ...(filters.effectiveFromBefore != null && { effectiveFrom: { lte: filters.effectiveFromBefore } }),
    ...(filters.effectiveToAfter != null && { effectiveTo: { gte: filters.effectiveToAfter } }),
    ...(filters.effectiveToBefore != null && { effectiveTo: { lte: filters.effectiveToBefore } }),
  };
}

import { SatelliteScheduleEntity } from '../../domain/entities/satellite-schedule.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllSatelliteSchedulesDto } from '../dtos/requests/satellite-schedule/fetch-all-satellite-schedules.dto';
import type { SatelliteScheduleFilters } from '../../domain/interfaces/satellite-schedule-filters.interface';

export function mapFetchAllSatelliteSchedulesDtoToQueryOptions(
  dto: FetchAllSatelliteSchedulesDto,
): QueryOptions<SatelliteScheduleEntity, SatelliteScheduleFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  const filters: SatelliteScheduleFilters = {
    ...(dto.name != null && { name: dto.name }),
    ...(dto.nameSlug != null && { nameSlug: dto.nameSlug }),
    ...(dto.status != null && { status: dto.status }),
    ...(dto.scheduleType != null && { scheduleType: dto.scheduleType }),
    ...(dto.effectiveFromAfter != null && { effectiveFromAfter: dto.effectiveFromAfter }),
    ...(dto.effectiveFromBefore != null && { effectiveFromBefore: dto.effectiveFromBefore }),
    ...(dto.effectiveToAfter != null && { effectiveToAfter: dto.effectiveToAfter }),
    ...(dto.effectiveToBefore != null && { effectiveToBefore: dto.effectiveToBefore }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
  };
}

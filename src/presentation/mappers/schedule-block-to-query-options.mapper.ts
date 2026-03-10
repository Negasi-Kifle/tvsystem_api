import { ScheduleBlockEntity } from '../../domain/entities/satellite-schedule-block.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchScheduleBlocksDto } from '../dtos/requests/satellite-schedule-block/fetch-schedule-blocks.dto';
import type { ScheduleBlockFilters } from '../../domain/interfaces/schedule-block-filters.interface';

export function mapFetchScheduleBlocksDtoToQueryOptions(
  dto: FetchScheduleBlocksDto,
  scheduleId: string,
): QueryOptions<ScheduleBlockEntity, ScheduleBlockFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 200;

  const filters: ScheduleBlockFilters = {
    scheduleId,
    ...(dto.dayOfWeek != null && { dayOfWeek: dto.dayOfWeek }),
    ...(dto.showId != null && { showId: dto.showId }),
    ...(dto.broadcastType != null && { broadcastType: dto.broadcastType }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
  };
}

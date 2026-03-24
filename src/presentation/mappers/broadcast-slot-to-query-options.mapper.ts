import { BroadcastSlotEntity } from '../../domain/entities/broadcast-slot.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { BroadcastSlotGroupBy, FetchBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/fetch-broadcast-slots.dto';
import type { BroadcastSlotFilters } from '../../domain/interfaces/broadcast-slot-filters.interface';

export function mapFetchBroadcastSlotsDtoToQueryOptions(
  dto: FetchBroadcastSlotsDto,
  scheduleId: string,
): QueryOptions<BroadcastSlotEntity, BroadcastSlotFilters, BroadcastSlotGroupBy> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 200;

  const filters: BroadcastSlotFilters = {
    scheduleId,
    ...(dto.showId != null && { showId: dto.showId }),
    ...(dto.dayOfWeek != null && { dayOfWeek: dto.dayOfWeek }),
    ...(dto.status != null && { status: dto.status }),
    ...(dto.broadcastType != null && { broadcastType: dto.broadcastType }),
    ...(dto.dateFrom != null && { dateFrom: dto.dateFrom }),
    ...(dto.dateTo != null && { dateTo: dto.dateTo }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
    groupBy: dto.groupBy,
  };
}

import { ShowSegmentSlotEntity } from '../../domain/entities/show-segment-slot.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { ShowSegmentSlotFilters } from '../../domain/interfaces/show-segment-slot-filters.interface';
import { FetchAllShowSegmentSlotsDto } from '../dtos/requests/show-segment-slot/fetch-all-show-segment-slots.dto';

export function mapFetchAllShowSegmentSlotsDtoToQueryOptions(
  dto: FetchAllShowSegmentSlotsDto,
): QueryOptions<ShowSegmentSlotEntity, ShowSegmentSlotFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  const filters: ShowSegmentSlotFilters = {
    ...(dto.showId != null && { showId: dto.showId }),
    ...(dto.customerId != null && { customerId: dto.customerId }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
  };
}

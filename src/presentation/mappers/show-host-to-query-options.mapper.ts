import { ShowHostEntity } from '../../domain/entities/show-host.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { ShowHostFilters } from '../../domain/interfaces/show-host-filters.interface';
import { FetchAllShowHostsDto } from '../dtos/requests/show-host/fetch-all-show-hosts.dto';

export function mapFetchAllShowHostsDtoToQueryOptions(
  dto: FetchAllShowHostsDto,
): QueryOptions<ShowHostEntity, ShowHostFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  const filters: ShowHostFilters = {
    ...(dto.showId != null && { showId: dto.showId }),
    ...(dto.userId != null && { userId: dto.userId }),
    ...(dto.revenueShareType != null && { revenueShareType: dto.revenueShareType }),
    ...(dto.isPrimary != null && { isPrimary: dto.isPrimary }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
  };
}


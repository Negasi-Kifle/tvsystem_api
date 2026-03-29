import { AdvertEntity } from '../../domain/entities/advert.entity';
import { AdvertStatus } from '../../domain/enums/advert-status.enum';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllAdvertsDto } from '../dtos/requests/advert/fetch-all-adverts.dto';

export function mapFetchAllAdvertsDtoToQueryOptions(dto: FetchAllAdvertsDto): QueryOptions<AdvertEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.showId != null && { showId: dto.showId }),
      ...(dto.customerId != null && { customerId: dto.customerId }),
      ...(dto.broadcastSlotId != null && { broadcastSlotId: dto.broadcastSlotId }),
      ...(dto.status != null && { status: dto.status as AdvertStatus }),
    },
  };
}

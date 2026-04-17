import { AdvertPlacementEntity } from '../../domain/entities/advert-placement.entity';
import { AdvertPlacementStatus } from '../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../domain/enums/advert-position.enum';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllAdvertPlacementsDto } from '../dtos/requests/advert-placement/fetch-all.dto';

export function mapFetchAllAdvertPlacementsDtoToQueryOptions(
  dto: FetchAllAdvertPlacementsDto,
): QueryOptions<AdvertPlacementEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.advertSalesId != null && { advertSalesId: dto.advertSalesId }),
      ...(dto.showId != null && { showId: dto.showId }),
      ...(dto.broadcastSlotId != null && { broadcastSlotId: dto.broadcastSlotId }),
      ...(dto.status != null && { status: dto.status as AdvertPlacementStatus }),
      ...(dto.position != null && { position: dto.position as AdvertPosition }),
      ...(dto.dateFrom != null && { dateFrom: dto.dateFrom }),
      ...(dto.dateTo != null && { dateTo: dto.dateTo }),
      ...(dto.broadcastCode != null && { broadcastCode: dto.broadcastCode }),
    },
  };
}

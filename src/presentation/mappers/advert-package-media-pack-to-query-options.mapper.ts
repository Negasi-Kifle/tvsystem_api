import { AdvertPackageMediaPackEntity } from '../../domain/entities/advert-package-media-pack.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllAdvertPackageMediaPacksDto } from '../dtos/requests/advert-package-media-pack/fetch-all.dto';

export function mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions(
  dto: FetchAllAdvertPackageMediaPacksDto,
): QueryOptions<AdvertPackageMediaPackEntity> {
  return {
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
    filters: {
      ...(dto.advertPackageId != null && { advertPackageId: dto.advertPackageId }),
      ...(dto.mediaPackId != null && { mediaPackId: dto.mediaPackId }),
    },
  };
}

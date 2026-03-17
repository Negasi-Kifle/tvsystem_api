import { AdvertPackageEntity } from '../../domain/entities/advert-package.entity';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { AdvertPackageFilters } from '../../domain/interfaces/advert-package-filters.interface';
import { FetchAllAdvertPackagesDto } from '../dtos/requests/advert-package/fetch-all.dto';

export function mapFetchAllAdvertPackagesDtoToQueryOptions(
  dto: FetchAllAdvertPackagesDto,
): QueryOptions<AdvertPackageEntity, AdvertPackageFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.mediaPackId != null && { mediaPackId: dto.mediaPackId }),
      ...(dto.isActive != null && { isActive: dto.isActive }),
      ...(dto.nameSlug != null && { nameSlug: dto.nameSlug }),
    },
  };
}

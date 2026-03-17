import { AdvertPackageEntity } from '../../../domain/entities/advert-package.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { AdvertPackageFilters } from '../../../domain/interfaces/advert-package-filters.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';

export class CountAdvertPackagesUseCase {
  constructor(private readonly advertPackageRepository: IAdvertPackageRepository) {}

  async execute(query: QueryOptions<AdvertPackageEntity, AdvertPackageFilters>): Promise<number> {
    return this.advertPackageRepository.count(query.filters ?? {});
  }
}

import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchAllAdvertPlacementsUseCase {
  constructor(private readonly placementRepo: IAdvertPlacementRepository) {}

  async execute(query: QueryOptions<AdvertPlacementEntity>): Promise<AdvertPlacementEntity[]> {
    return this.placementRepo.findMany(query);
  }
}

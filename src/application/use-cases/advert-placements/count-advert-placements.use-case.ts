import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';

export class CountAdvertPlacementsUseCase {
  constructor(private readonly placementRepo: IAdvertPlacementRepository) {}

  async execute(filters?: Partial<AdvertPlacementEntity>): Promise<number> {
    return this.placementRepo.count(filters);
  }
}

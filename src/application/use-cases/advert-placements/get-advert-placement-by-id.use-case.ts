import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';

export class GetAdvertPlacementByIdUseCase {
  constructor(private readonly placementRepo: IAdvertPlacementRepository) {}

  async execute(id: string): Promise<AdvertPlacementEntity> {
    const placement = await this.placementRepo.findById(id);
    if (!placement) {
      throw new EntityNotFoundError('Advert placement not found', 'AdvertPlacement', id);
    }
    return placement;
  }
}

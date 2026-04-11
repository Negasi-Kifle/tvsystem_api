import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';

export class DeleteAdvertPlacementUseCase {
  constructor(private readonly placementRepo: IAdvertPlacementRepository) {}

  async execute(id: string): Promise<void> {
    const placement = await this.placementRepo.findById(id);
    if (!placement) {
      throw new EntityNotFoundError('Advert placement not found', 'AdvertPlacement', id);
    }
    await this.placementRepo.deleteById(id);
  }
}

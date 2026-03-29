import { AdvertEntity } from '../../../domain/entities/advert.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';

export class GetAdvertByIdUseCase {
  constructor(private readonly advertRepo: IAdvertRepository) {}

  async execute(id: string): Promise<AdvertEntity> {
    const advert = await this.advertRepo.findById(id);
    if (!advert) {
      throw new EntityNotFoundError('Advert not found', 'Advert', id);
    }
    return advert;
  }
}

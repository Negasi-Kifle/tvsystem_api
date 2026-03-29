import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';

export class DeleteAdvertUseCase {
  constructor(private readonly advertRepo: IAdvertRepository) {}

  async execute(id: string): Promise<void> {
    const advert = await this.advertRepo.findById(id);
    if (!advert) {
      throw new EntityNotFoundError('Advert not found', 'Advert', id);
    }
    await this.advertRepo.deleteById(id);
  }
}

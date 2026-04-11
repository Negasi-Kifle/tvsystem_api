import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';

export class DeleteAdvertSalesUseCase {
  constructor(private readonly advertSalesRepo: IAdvertSalesRepository) {}

  async execute(id: string): Promise<void> {
    const row = await this.advertSalesRepo.findById(id);
    if (!row) {
      throw new EntityNotFoundError('Advert sales not found', 'AdvertSales', id);
    }
    await this.advertSalesRepo.deleteById(id);
  }
}

import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';

export class GetAdvertSalesByIdUseCase {
  constructor(private readonly advertSalesRepo: IAdvertSalesRepository) {}

  async execute(id: string): Promise<AdvertSalesEntity> {
    const row = await this.advertSalesRepo.findById(id);
    if (!row) {
      throw new EntityNotFoundError('Advert sales not found', 'AdvertSales', id);
    }
    return row;
  }
}

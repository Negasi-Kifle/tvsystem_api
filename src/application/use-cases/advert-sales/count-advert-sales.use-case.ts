import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';

export class CountAdvertSalesUseCase {
  constructor(private readonly advertSalesRepo: IAdvertSalesRepository) {}

  async execute(query: QueryOptions<AdvertSalesEntity>): Promise<number> {
    return this.advertSalesRepo.count(query.filters);
  }
}

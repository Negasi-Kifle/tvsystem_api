import { AdvertSalesEntity } from '../../../domain/entities/adver-sales.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';

export class FetchAllAdvertSalesUseCase {
  constructor(private readonly advertSalesRepo: IAdvertSalesRepository) {}

  async execute(query: QueryOptions<AdvertSalesEntity>): Promise<AdvertSalesEntity[]> {
    return this.advertSalesRepo.findMany(query);
  }
}

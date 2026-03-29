import { AdvertEntity } from '../../../domain/entities/advert.entity';
import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchAllAdvertsUseCase {
  constructor(private readonly advertRepo: IAdvertRepository) {}

  async execute(query: QueryOptions<AdvertEntity>): Promise<AdvertEntity[]> {
    return this.advertRepo.findMany(query);
  }
}

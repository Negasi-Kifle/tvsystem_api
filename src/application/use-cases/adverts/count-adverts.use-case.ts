import { AdvertEntity } from '../../../domain/entities/advert.entity';
import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';

export class CountAdvertsUseCase {
  constructor(private readonly advertRepo: IAdvertRepository) {}

  async execute(filters?: Partial<AdvertEntity>): Promise<number> {
    return this.advertRepo.count(filters);
  }
}

import { CategoryEntity } from '../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchAllCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(query?: QueryOptions<CategoryEntity>): Promise<CategoryEntity[]> {
    return this.categoryRepo.findMany(query ?? { take: 100 });
  }
}

import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';

export class FetchSubCategoriesByCategoryUseCase {
  constructor(private readonly subCategoryRepo: ISubCategoryRepository) {}

  async execute(categoryId: string): Promise<SubCategoryEntity[]> {
    return this.subCategoryRepo.findMany({
      filters: { categoryId },
      take: 100,
    });
  }
}

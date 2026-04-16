import { CategoryEntity } from "../../../domain/entities/category.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository.interface";


export class CountCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(filters?: Partial<CategoryEntity>): Promise<number> {
    return this.categoryRepo.count(filters);
  }
}
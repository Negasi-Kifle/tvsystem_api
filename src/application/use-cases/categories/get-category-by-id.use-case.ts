import { CategoryEntity } from '../../../domain/entities/category.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new EntityNotFoundError('Category not found', 'Category', id);
    }
    return category;
  }
}

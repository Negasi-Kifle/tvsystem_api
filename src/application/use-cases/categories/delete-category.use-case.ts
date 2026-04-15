import { CategoryEntity } from '../../../domain/entities/category.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { ValidationError } from '../../../domain/errors/validation.error';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string): Promise<CategoryEntity> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Category not found', 'Category', id);
    }

    if (existing.subCategories.length > 0) {
      throw new ValidationError(
        'Cannot delete category while sub-categories exist. Remove or reassign sub-categories first.',
      );
    }

    const deleted = await this.categoryRepo.deleteById(id);
    if (!deleted) {
      throw new EntityNotFoundError('Category not found', 'Category', id);
    }
    return deleted;
  }
}

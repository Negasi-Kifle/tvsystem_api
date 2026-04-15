import { CategoryEntity } from '../../../domain/entities/category.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';

export type UpdateCategoryInput = {
  name?: string;
  nameSlug?: string;
};

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string, payload: UpdateCategoryInput): Promise<CategoryEntity> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Category not found', 'Category', id);
    }

    const nextName = payload.name ?? existing.name;
    const nextSlug =
      payload.nameSlug ??
      (payload.name !== undefined ? payload.name.toLowerCase().replace(/\s+/g, '-') : existing.nameSlug);

    const slugOwner = await this.categoryRepo.findByNameSlug(nextSlug);
    if (slugOwner && slugOwner.id !== id) {
      throw new EntityAlreadyExistsError(
        `Category with slug ${nextSlug} already exists`,
        'Category',
        nextSlug,
      );
    }

    existing.updateInstance(nextName, nextSlug);
    const updated = await this.categoryRepo.update(existing);
    if (!updated) {
      throw new EntityNotFoundError('Category not found', 'Category', id);
    }
    return updated;
  }
}

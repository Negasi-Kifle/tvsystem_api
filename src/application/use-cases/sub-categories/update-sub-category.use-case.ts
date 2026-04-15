import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';

export type UpdateSubCategoryInput = {
  name?: string;
  nameSlug?: string;
  isCustom?: boolean;
  categoryId?: string;
};

export class UpdateSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepo: ISubCategoryRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string, payload: UpdateSubCategoryInput): Promise<SubCategoryEntity> {
    const existing = await this.subCategoryRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Sub-category not found', 'SubCategory', id);
    }

    const targetCategoryId = payload.categoryId ?? existing.categoryId;

    if (payload.categoryId !== undefined) {
      const category = await this.categoryRepo.findById(payload.categoryId);
      if (!category) {
        throw new EntityNotFoundError('Category not found', 'Category', payload.categoryId);
      }
    }

    const nextName = payload.name ?? existing.name;
    const nextSlug =
      payload.nameSlug ??
      (payload.name !== undefined ? payload.name.toLowerCase().replace(/\s+/g, '-') : existing.nameSlug);

    const slugOwner = await this.subCategoryRepo.findByCategoryAndSlug(targetCategoryId, nextSlug);
    if (slugOwner && slugOwner.id !== id) {
      throw new EntityAlreadyExistsError(
        `Sub-category with slug ${nextSlug} already exists in this category`,
        'SubCategory',
        nextSlug,
      );
    }

    existing.updateInstance(
      payload.name !== undefined ? nextName : undefined,
      payload.nameSlug !== undefined || payload.name !== undefined ? nextSlug : undefined,
      payload.isCustom,
      payload.categoryId,
    );

    const updated = await this.subCategoryRepo.update(existing);
    if (!updated) {
      throw new EntityNotFoundError('Sub-category not found', 'SubCategory', id);
    }
    return updated;
  }
}

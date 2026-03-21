import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';

export type CreateSubCategoryInput = {
  categoryId: string;
  name: string;
  nameSlug?: string;
  isCustom?: boolean;
};

export class CreateSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepo: ISubCategoryRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(payload: CreateSubCategoryInput): Promise<SubCategoryEntity> {
    const category = await this.categoryRepo.findById(payload.categoryId);
    if (!category) {
      throw new EntityNotFoundError('Category not found', 'Category', payload.categoryId);
    }

    const nameSlug = payload.nameSlug ?? payload.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.subCategoryRepo.findByCategoryAndSlug(payload.categoryId, nameSlug);
    if (existing) {
      throw new EntityAlreadyExistsError(
        `Sub-category with slug ${nameSlug} already exists in this category`,
        'SubCategory',
        nameSlug,
      );
    }

    const subCategory = SubCategoryEntity.createInstance(
      payload.categoryId,
      payload.name,
      nameSlug,
      payload.isCustom ?? true,
    );

    return this.subCategoryRepo.create(subCategory);
  }
}

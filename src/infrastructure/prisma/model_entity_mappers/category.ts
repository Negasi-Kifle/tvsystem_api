import { Category, SubCategory } from '../generated/client';
import { CategoryEntity } from '../../../domain/entities/category.entity.js';
import { modelToEntity as subCategoryModelToEntity } from './sub-category.js';

export function modelToEntity(model: Category & { subCategories?: SubCategory[] }): CategoryEntity {
  const subCategories = model.subCategories?.map(subCategoryModelToEntity) ?? [];
  return CategoryEntity.createInstance(
    model.name,
    model.nameSlug,
    model.createdAt,
    model.updatedAt,
    model.id,
    subCategories,
  );
}

export function entityToModel(entity: CategoryEntity) {
  return {
    id: entity.id ?? '',
    name: entity.name,
    nameSlug: entity.nameSlug,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

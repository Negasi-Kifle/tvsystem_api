import { SubCategory, Category } from '../generated/client';
import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity.js';
import { CategoryEntity } from '../../../domain/entities/category.entity.js';

function mapCategoryParent(model: Category): CategoryEntity {
  return CategoryEntity.createInstance(
    model.name,
    model.nameSlug,
    model.createdAt,
    model.updatedAt,
    model.id,
    [],
  );
}

export function modelToEntity(model: SubCategory & { category?: Category }): SubCategoryEntity {
  const entity = SubCategoryEntity.createInstance(
    model.categoryId,
    model.name,
    model.nameSlug,
    model.isCustom,
    model.createdAt,
    model.updatedAt,
    model.id,
    model.category ? mapCategoryParent(model.category) : undefined,
  );
  return entity;
}

export function entityToModel(entity: SubCategoryEntity) {
  return {
    id: entity.id ?? '',
    categoryId: entity.categoryId,
    name: entity.name,
    nameSlug: entity.nameSlug,
    isCustom: entity.isCustom,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

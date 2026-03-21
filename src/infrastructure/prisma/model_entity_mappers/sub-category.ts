import { SubCategory } from '../generated/client';
import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity.js';

export function modelToEntity(model: SubCategory): SubCategoryEntity {
  return SubCategoryEntity.createInstance(
    model.categoryId,
    model.name,
    model.nameSlug,
    model.isCustom,
    model.createdAt,
    model.updatedAt,
    model.id,
  );
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

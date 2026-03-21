import { Category } from '../generated/client';
import { CategoryEntity } from '../../../domain/entities/category.entity.js';

export function modelToEntity(model: Category): CategoryEntity {
  return CategoryEntity.createInstance(
    model.name,
    model.nameSlug,
    model.createdAt,
    model.updatedAt,
    model.id,
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

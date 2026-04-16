import { Prisma } from '../generated/client';
import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';

export function buildWhereClauseForSubCategory(filters: Partial<SubCategoryEntity>): Prisma.SubCategoryWhereInput {
  if (!filters) return {};
  return {
    ...(filters.id !== undefined && { id: filters.id }),
    ...(filters.categoryId !== undefined && { categoryId: filters.categoryId }),
    ...(filters.name !== undefined && { name: filters.name }),
    ...(filters.nameSlug !== undefined && { nameSlug: filters.nameSlug }),
    ...(filters.isCustom !== undefined && { isCustom: filters.isCustom }),
  };
}

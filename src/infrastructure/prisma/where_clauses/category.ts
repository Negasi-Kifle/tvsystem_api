import { Prisma } from '../generated/client';
import { CategoryEntity } from '../../../domain/entities/category.entity';

export function buildWhereClauseForCategory(filters: Partial<CategoryEntity>): Prisma.CategoryWhereInput {
  if (!filters) return {};
  return {
    ...(filters.name !== undefined && { name: filters.name }),
    ...(filters.nameSlug !== undefined && { nameSlug: filters.nameSlug }),
  };
}

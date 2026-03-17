import { Prisma } from '../generated/client';
import { AdvertPackageFilters } from '../../../domain/interfaces/advert-package-filters.interface';

export function buildWhereClauseForAdvertPackage(
  filters: Partial<AdvertPackageFilters> | Record<string, unknown>,
): Prisma.AdvertPackageWhereInput {
  if (!filters) return {};

  const f = filters as Partial<AdvertPackageFilters>;
  return {
    ...(f.mediaPackId !== undefined && { mediaPackId: f.mediaPackId }),
    ...(f.isActive !== undefined && { isActive: f.isActive }),
    ...(f.nameSlug !== undefined && { nameSlug: f.nameSlug }),
  };
}

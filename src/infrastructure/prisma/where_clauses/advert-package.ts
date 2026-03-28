import { Prisma } from '../generated/client';
import { AdvertPackageFilters } from '../../../domain/interfaces/advert-package-filters.interface';

export function buildWhereClauseForAdvertPackage(
  filters: Partial<AdvertPackageFilters> | Record<string, unknown>,
): Prisma.AdvertPackageWhereInput {
  if (!filters) return {};

  const f = filters as Partial<AdvertPackageFilters>;
  return {
    ...(f.id !== undefined && (Array.isArray(f.id) ? { id: { in: f.id } } : { id: f.id })),
    ...(f.isActive !== undefined && { isActive: f.isActive }),
    ...(f.name !== undefined && { name: { contains: f.name, mode: 'insensitive' as Prisma.QueryMode } }),
    ...(f.nameSlug !== undefined && { nameSlug: f.nameSlug }),
    ...(f.showIds !== undefined && (Array.isArray(f.showIds) ? { showIds: { hasSome: f.showIds } } : { showIds: f.showIds })),
    ...(f.advertisementsCount !== undefined && { advertisementsCount: f.advertisementsCount }),
    ...(f.announcementsCount !== undefined && { announcementsCount: f.announcementsCount }),
    ...(f.popUpsCount !== undefined && { popUpsCount: f.popUpsCount }),
    ...(f.bonusesCount !== undefined && { bonusesCount: f.bonusesCount }),
    ...(f.priceBeforeVAT !== undefined && { priceBeforeVAT: f.priceBeforeVAT }),
    ...(f.otherTaxes !== undefined && { otherTaxes: f.otherTaxes }),
    ...(f.finalPrice !== undefined && { finalPrice: f.finalPrice }),
    ...(f.advertisementsRerunCount !== undefined && { advertisementsRerunCount: f.advertisementsRerunCount }),
    ...(f.announcementsRerunCount !== undefined && { announcementsRerunCount: f.announcementsRerunCount }),
    ...(f.popUpsRerunCount !== undefined && { popUpsRerunCount: f.popUpsRerunCount }),
    ...(f.bonusesRerunCount !== undefined && { bonusesRerunCount: f.bonusesRerunCount }),
    ...(f.description !== undefined && { description: { contains: f.description, mode: 'insensitive' as Prisma.QueryMode } }),
    ...(f.imageUrl !== undefined && { imageUrl: f.imageUrl }),
    ...(f.createdAt !== undefined && { createdAt: f.createdAt }),
    ...(f.updatedAt !== undefined && { updatedAt: f.updatedAt }),
  };
}

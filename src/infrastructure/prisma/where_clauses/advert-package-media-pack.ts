import { AdvertPackageMediaPackEntity } from '../../../domain/entities/advert-package-media-pack.entity';
import { Prisma } from '../generated/client';

export function buildWhereClauseForAdvertPackageMediaPack(
  filters: Partial<AdvertPackageMediaPackEntity>,
): Prisma.AdvertPackageMediaPackWhereInput {
  if (!filters) return {};

  return {
    ...(filters.advertPackageId && { advertPackageId: filters.advertPackageId }),
    ...(filters.mediaPackId && { mediaPackId: filters.mediaPackId }),
  };
}

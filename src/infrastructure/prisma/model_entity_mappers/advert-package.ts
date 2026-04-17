import { AdvertPackage } from '../generated/client';
import { AdvertPackageEntity } from '../../../domain/entities/advert-package.entity';
import { MediaPackSummary } from '../../../domain/interfaces/media-pack-summary.interface';
import { Prisma } from '../generated/client';
import { ShowSummary } from '../../../domain/interfaces/show-summary.interface';
import { ShowType } from '../../../domain/enums/show-type.enum';

export const advertPackageReadInclude = {
  mediaPackLinks: { include: { mediaPack: true } },
  showLinks: { include: { show: true } },
} as const;

type AdvertPackageWithRelations = Prisma.AdvertPackageGetPayload<{
  include: typeof advertPackageReadInclude;
}>;

type AdvertPackageLike = Prisma.AdvertPackageGetPayload<{}> & Partial<{
  mediaPackLinks: AdvertPackageWithRelations['mediaPackLinks'];
  showLinks: AdvertPackageWithRelations['showLinks'];
}>;

function mediaPackToSummary(
  mediaPack: NonNullable<AdvertPackageWithRelations['mediaPackLinks'][number]['mediaPack']>,
): MediaPackSummary {
  return {
    id: mediaPack.id ?? '',
    version: mediaPack.version ?? '',
    versionSlug: mediaPack.versionSlug ?? '',
  };
}

function showToSummary(show: AdvertPackageWithRelations['showLinks'][number]['show']): ShowSummary {
  return {
    id: show.id,
    title: show.title,
    titleSlug: show.titleSlug,
    type: show.type as ShowType,
    durationMinutes: show.durationMinutes,
    maxAdLengthMinutes: show.maxAdLengthMinutes,
    totalDurationMinutes: show.totalDurationMinutes,
    partsCount: show.partsCount,
    rerunsCount: show.rerunsCount,
    bonusCount: show.bonusCount,
  };
}

export function modelToEntity(model: AdvertPackageLike): AdvertPackageEntity {
  const mediaPacks =
    model.mediaPackLinks
      ?.map((link) => link.mediaPack)
      .filter((mp): mp is NonNullable<typeof mp> => mp != null)
      .map(mediaPackToSummary) ?? [];

  const showIds = model.showLinks?.map((link) => link.showId) ?? [];

  return AdvertPackageEntity.createInstance(
    model.name,
    model.nameSlug,
    showIds,
    model.advertisementsCount,
    model.announcementsCount,
    model.popUpsCount,
    model.bonusesCount,
    model.priceBeforeVAT,
    model.otherTaxes,
    model.finalPrice,
    model.isActive,
    model.advertisementsRerunCount,
    model.announcementsRerunCount,
    model.popUpsRerunCount,
    model.bonusesRerunCount,
    model.description ?? undefined,
    model.imageUrl ?? null,
    model.createdAt,
    model.updatedAt,
    model.id,
    mediaPacks.length > 0 ? mediaPacks : undefined,
    model.showLinks?.map((link) => showToSummary(link.show)) ?? [],
  );
}

export function entityToModel(entity: AdvertPackageEntity): Omit<AdvertPackage, 'mediaPackLinks' | 'showLinks'> {
  return {
    id: entity.id ?? '',
    name: entity.name,
    nameSlug: entity.nameSlug,
    advertisementsCount: entity.advertisementsCount,
    announcementsCount: entity.announcementsCount,
    popUpsCount: entity.popUpsCount,
    bonusesCount: entity.bonusesCount,
    priceBeforeVAT: entity.priceBeforeVAT,
    otherTaxes: entity.otherTaxes,
    finalPrice: entity.finalPrice,
    isActive: entity.isActive,
    advertisementsRerunCount: entity.advertisementsRerunCount,
    announcementsRerunCount: entity.announcementsRerunCount,
    popUpsRerunCount: entity.popUpsRerunCount,
    bonusesRerunCount: entity.bonusesRerunCount,
    description: entity.description ?? null,
    imageUrl: entity.imageUrl ?? null,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

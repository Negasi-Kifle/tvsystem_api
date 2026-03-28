import { AdvertPackageMediaPack, Prisma } from '../generated/client';
import { AdvertPackageMediaPackEntity } from '../../../domain/entities/advert-package-media-pack.entity';
import { advertPackageReadInclude, modelToEntity as advertPackageModelToEntity } from './advert-package';
import { modelToEntity as mediaPackModelToEntity } from './media-pack';

type AdvertPackageMediaPackWithRelations = Prisma.AdvertPackageMediaPackGetPayload<{
  include: {
    advertPackage: { include: typeof advertPackageReadInclude };
    mediaPack: true;
  };
}>;

type AdvertPackageMediaPackLike =
  | Prisma.AdvertPackageMediaPackGetPayload<{}>
  | AdvertPackageMediaPackWithRelations;

export function modelToEntity(model: AdvertPackageMediaPackLike): AdvertPackageMediaPackEntity {
  const advertPackage =
    'advertPackage' in model && model.advertPackage != null
      ? advertPackageModelToEntity(model.advertPackage)
      : undefined;

  const mediaPack =
    'mediaPack' in model && model.mediaPack != null ? mediaPackModelToEntity(model.mediaPack) : undefined;

  return new AdvertPackageMediaPackEntity(
    model.advertPackageId,
    model.mediaPackId,
    model.createdAt,
    model.updatedAt,
    model.id,
    advertPackage,
    mediaPack,
  );
}

export function entityToModel(entity: AdvertPackageMediaPackEntity): AdvertPackageMediaPack {
  return {
    id: entity.id ?? '',
    advertPackageId: entity.advertPackageId,
    mediaPackId: entity.mediaPackId,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

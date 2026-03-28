import { Prisma, MediaPack } from '../generated/client';
import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import {
    advertPackageReadInclude,
    modelToEntity as advertPackageModelToEntity,
} from "./advert-package";

type MediaPackWithRelations = Prisma.MediaPackGetPayload<{
    include: {
        advertPackageMediaPackLinks: {
            include: {
                advertPackage: { include: typeof advertPackageReadInclude };
            };
        };
    };
}>;

type MediaPackLike = Prisma.MediaPackGetPayload<{}> & Partial<{
    advertPackageMediaPackLinks: MediaPackWithRelations['advertPackageMediaPackLinks'];
}>;

export function modelToEntity(model: MediaPackLike): MediaPackEntity {
    const advertPackages = model.advertPackageMediaPackLinks
        ?.map((link) => link.advertPackage)
        .filter((pkg): pkg is NonNullable<typeof pkg> => pkg != null)
        .map((pkg) => advertPackageModelToEntity(pkg));

    return MediaPackEntity.createInstance(
        model.version,
        model.versionSlug,
        model.description ?? undefined,
        model.isActive,
        model.createdAt,
        model.updatedAt,
        model.id,
        advertPackages,
    );
}

export function entityToModel(entity: MediaPackEntity): MediaPack {
    return {
        id: entity.id ?? '',
        version: entity.version,
        versionSlug: entity.versionSlug,
        description: entity.description ?? null,
        isActive: entity.isActive,
        createdAt: entity.createdAt ?? new Date(),
        updatedAt: entity.updatedAt ?? new Date(),
    };
}

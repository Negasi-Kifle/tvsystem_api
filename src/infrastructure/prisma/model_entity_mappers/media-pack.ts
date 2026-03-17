import { Prisma, MediaPack } from '../generated/client';
import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { modelToEntity as advertPackageModelToEntity } from "./advert-package";

type MediaPackWithRelations = Prisma.MediaPackGetPayload<{
    include: {
        advertPackages: {
            include: {
                showLinks: { include: { show: true } },
            },
        },
    },
}>;

type MediaPackLike = Prisma.MediaPackGetPayload<{}> & Partial<{
    advertPackages: MediaPackWithRelations['advertPackages'];
}>;

export function modelToEntity(model: MediaPackLike): MediaPackEntity {
    return MediaPackEntity.createInstance(
        model.version,
        model.versionSlug,
        model.description ?? undefined,
        model.isActive,
        model.createdAt,
        model.updatedAt,
        model.id,
        model.advertPackages?.map((pkg) => advertPackageModelToEntity(pkg)),
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

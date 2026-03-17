import { Prisma } from "../generated/client";
import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";

export function buildWhereClauseForMediaPack(filters: Partial<MediaPackEntity>): Prisma.MediaPackWhereInput {
    if (!filters) return {};

    return {
        ...(filters.version !== undefined && { version: filters.version }),
        ...(filters.versionSlug !== undefined && { versionSlug: filters.versionSlug }),
        ...(filters.description !== undefined && { description: filters.description }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
}

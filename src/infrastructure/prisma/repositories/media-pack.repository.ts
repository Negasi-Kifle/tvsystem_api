import { Prisma } from '../generated/client';
import { PrismaBaseRepository } from "./base.repository";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";
import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { modelToEntity } from "../model_entity_mappers/media-pack";
import { buildWhereClauseForMediaPack } from "../where_clauses/media-pack";
import { advertPackageReadInclude } from '../model_entity_mappers/advert-package';

const mediaPackWithAdvertPackagesInclude = {
    advertPackageMediaPackLinks: {
        include: {
            advertPackage: { include: advertPackageReadInclude },
        },
    },
} satisfies Prisma.MediaPackInclude;

export class MediaPackRepository extends PrismaBaseRepository implements IMediaPackRepository {

    async findById(id: string): Promise<MediaPackEntity | null> {
        const mediaPack = await this.prisma.mediaPack.findUnique({
            where: { id }, include: mediaPackWithAdvertPackagesInclude,
        });
        return mediaPack ? modelToEntity(mediaPack) : null;
    }

    async findMany(query: QueryOptions<MediaPackEntity, Partial<MediaPackEntity>>): Promise<MediaPackEntity[]> {
        const where = buildWhereClauseForMediaPack(query.filters ?? {});
        const list = await this.prisma.mediaPack.findMany({
            where,
            skip: query.skip ?? 0,
            take: query.take ?? 10,
            include: mediaPackWithAdvertPackagesInclude,
        });
        return list.map(modelToEntity);
    }

    async count(filters?: Partial<MediaPackEntity>): Promise<number> {
        const where = buildWhereClauseForMediaPack(filters ?? {});
        return this.prisma.mediaPack.count({ where });
    }

    async create(data: Omit<MediaPackEntity, 'id'>): Promise<MediaPackEntity> {
        const entity = data as MediaPackEntity;
        const createData: Prisma.MediaPackCreateInput = {
            version: entity.version,
            versionSlug: entity.versionSlug,
            description: entity.description ?? null,
            isActive: entity.isActive,
        };
        const saved = await this.prisma.mediaPack.create({ data: createData });
        return modelToEntity(saved);
    }

    async update(entity: MediaPackEntity): Promise<MediaPackEntity | null> {
        if (!entity.id) return null;
        const data: Prisma.MediaPackUpdateInput = {
            version: entity.version,
            versionSlug: entity.versionSlug,
            description: entity.description ?? null,
            isActive: entity.isActive,
            updatedAt: new Date(),
        };
        const updated = await this.prisma.mediaPack.update({
            where: { id: entity.id },
            data,
        });
        return modelToEntity(updated);
    }

    async deleteById(id: string): Promise<MediaPackEntity | null> {
        try {
            const deleted = await this.prisma.mediaPack.delete({ where: { id } });
            return modelToEntity(deleted);
        } catch {
            return null;
        }
    }

    async findByVersionSlug(versionSlug: string): Promise<MediaPackEntity | null> {
        const mediaPack = await this.prisma.mediaPack.findUnique({ where: { versionSlug } });
        return mediaPack ? modelToEntity(mediaPack) : null;
    }
}

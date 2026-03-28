import { IAdvertPackageMediaPackRepository } from '../../../domain/repositories/advert-package-media-pack.repository.interface';
import { PrismaBaseRepository } from './base.repository';
import { AdvertPackageMediaPackEntity } from '../../../domain/entities/advert-package-media-pack.entity';
import { modelToEntity } from '../model_entity_mappers/advert-package-media-pack';
import { buildWhereClauseForAdvertPackageMediaPack } from '../where_clauses/advert-package-media-pack';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { Prisma } from '../generated/client';
import { advertPackageReadInclude } from '../model_entity_mappers/advert-package';

const advertPackageMediaPackInclude = {
  advertPackage: {
    include: advertPackageReadInclude,
  },
  mediaPack: true,
} satisfies Prisma.AdvertPackageMediaPackInclude;

export class AdvertPackageMediaPackRepository
  extends PrismaBaseRepository
  implements IAdvertPackageMediaPackRepository
{
  async create(data: Omit<AdvertPackageMediaPackEntity, 'id'>): Promise<AdvertPackageMediaPackEntity> {
    const row = await this.prisma.advertPackageMediaPack.create({
      data: {
        advertPackageId: data.advertPackageId,
        mediaPackId: data.mediaPackId,
      },
      include: advertPackageMediaPackInclude,
    });
    return modelToEntity(row);
  }

  async createMany(
    advertPackageMediaPacks: Omit<AdvertPackageMediaPackEntity, 'id'>[],
  ): Promise<AdvertPackageMediaPackEntity[]> {
    if (advertPackageMediaPacks.length === 0) {
      return [];
    }
    const rows = await this.prisma.advertPackageMediaPack.createManyAndReturn({
      data: advertPackageMediaPacks.map((e) => ({
        advertPackageId: e.advertPackageId,
        mediaPackId: e.mediaPackId,
      })),
      include: advertPackageMediaPackInclude,
    });
    return rows.map(modelToEntity);
  }

  async findById(id: string): Promise<AdvertPackageMediaPackEntity | null> {
    const row = await this.prisma.advertPackageMediaPack.findUnique({
      where: { id },
      include: advertPackageMediaPackInclude,
    });
    return row ? modelToEntity(row) : null;
  }

  async findMany(query: QueryOptions<AdvertPackageMediaPackEntity>): Promise<AdvertPackageMediaPackEntity[]> {
    const where = buildWhereClauseForAdvertPackageMediaPack(query.filters ?? {});
    const rows = await this.prisma.advertPackageMediaPack.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: advertPackageMediaPackInclude,
    });
    return rows.map(modelToEntity);
  }

  async count(filters?: Partial<AdvertPackageMediaPackEntity>): Promise<number> {
    const where = buildWhereClauseForAdvertPackageMediaPack(filters ?? {});
    return this.prisma.advertPackageMediaPack.count({ where });
  }

  async update(entity: AdvertPackageMediaPackEntity): Promise<AdvertPackageMediaPackEntity | null> {
    if (!entity.id) return null;
    const row = await this.prisma.advertPackageMediaPack.update({
      where: { id: entity.id },
      data: {
        advertPackageId: entity.advertPackageId,
        mediaPackId: entity.mediaPackId,
      },
      include: advertPackageMediaPackInclude,
    });
    return modelToEntity(row);
  }

  async deleteById(id: string): Promise<AdvertPackageMediaPackEntity | null> {
    const row = await this.prisma.advertPackageMediaPack.delete({
      where: { id },
      include: advertPackageMediaPackInclude,
    });
    return row ? modelToEntity(row) : null;
  }
}

import { PrismaBaseRepository } from './base.repository';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { AdvertPackageEntity } from '../../../domain/entities/advert-package.entity';
import { MediaPackEntity } from '../../../domain/entities/media-pack.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { AdvertPackageFilters } from '../../../domain/interfaces/advert-package-filters.interface';
import { entityToModel, modelToEntity } from '../model_entity_mappers/advert-package';
import { buildWhereClauseForAdvertPackage } from '../where_clauses/advert-package';
import { modelToEntity as mediaPackModelToEntity } from '../model_entity_mappers/media-pack';

export class AdvertPackageRepository extends PrismaBaseRepository implements IAdvertPackageRepository {
  async findById(id: string): Promise<AdvertPackageEntity | null> {
    const record = await this.prisma.advertPackage.findUnique({
      where: { id },
      include: {
        mediaPack: true,
        showLinks: { include: { show: true } },
      },
    });
    return record ? modelToEntity(record) : null;
  }

  async findMany(
    query: QueryOptions<AdvertPackageEntity, AdvertPackageFilters>,
  ): Promise<AdvertPackageEntity[]> {
    const where = buildWhereClauseForAdvertPackage(query.filters ?? {});
    
    const records = await this.prisma.advertPackage.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: {
        mediaPack: true,
        showLinks: { include: { show: true } },
      },
    });
    return records.map(modelToEntity);
  }

  async count(filters?: Partial<AdvertPackageEntity> | AdvertPackageFilters): Promise<number> {
    const where = buildWhereClauseForAdvertPackage((filters ?? {}) as Partial<AdvertPackageFilters>);
    return this.prisma.advertPackage.count({ where });
  }

  async create(data: Omit<AdvertPackageEntity, 'id'>): Promise<AdvertPackageEntity> {
    const entity = data as AdvertPackageEntity;
    const model = entityToModel(entity);
    const { id: _omit, ...createData } = model;
    const saved = await this.prisma.advertPackage.create({
      data: {
        ...createData,
        showLinks: {
          create: (entity.showIds ?? []).map((showId) => ({ showId })),
        },
      },
      include: {
        mediaPack: true,
        showLinks: { include: { show: true } },
      },
    });
    return modelToEntity(saved);
  }

  async update(entity: AdvertPackageEntity): Promise<AdvertPackageEntity | null> {
    if (!entity.id) return null;
    const model = entityToModel(entity);
    const updated = await this.prisma.advertPackage.update({
      where: { id: entity.id },
      data: {
        name: model.name,
        nameSlug: model.nameSlug,
        mediaPackId: model.mediaPackId,
        showIds: model.showIds,
        advertisementsCount: model.advertisementsCount,
        announcementsCount: model.announcementsCount,
        popUpsCount: model.popUpsCount,
        bonusesCount: model.bonusesCount,
        priceBeforeVAT: model.priceBeforeVAT,
        otherTaxes: model.otherTaxes,
        finalPrice: model.finalPrice,
        isActive: model.isActive,
        advertisementsRerunCount: model.advertisementsRerunCount,
        announcementsRerunCount: model.announcementsRerunCount,
        popUpsRerunCount: model.popUpsRerunCount,
        bonusesRerunCount: model.bonusesRerunCount,
        description: model.description,
        showLinks: {
          deleteMany: {},
          create: (entity.showIds ?? []).map((showId) => ({ showId })),
        },
      },
      include: {
        mediaPack: true,
        showLinks: { include: { show: true } },
      },
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<AdvertPackageEntity | null> {
    try {
      const deleted = await this.prisma.advertPackage.delete({
        where: { id },
        include: {
          mediaPack: true,
          showLinks: { include: { show: true } },
        },
      });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }

  async createAdvertPackageWithVersion(
    advertPackage: Omit<AdvertPackageEntity, 'id'>,
    version: Omit<MediaPackEntity, 'id'>,
  ): Promise<{ advertPackage: AdvertPackageEntity; version: MediaPackEntity }> {
    const mediaPack = await this.prisma.mediaPack.create({
      data: {
        version: version.version,
        versionSlug: version.versionSlug,
        description: version.description ?? null,
        isActive: version.isActive ?? true,
      },
    });
    const versionEntity = mediaPackModelToEntity(mediaPack);
    const pkgEntity = AdvertPackageEntity.createInstance(
      advertPackage.name,
      advertPackage.nameSlug,
      mediaPack.id,
      advertPackage.showIds,
      advertPackage.advertisementsCount,
      advertPackage.announcementsCount,
      advertPackage.popUpsCount,
      advertPackage.bonusesCount,
      advertPackage.priceBeforeVAT,
      advertPackage.otherTaxes,
      advertPackage.finalPrice,
      advertPackage.isActive,
      advertPackage.advertisementsRerunCount,
      advertPackage.announcementsRerunCount,
      advertPackage.popUpsRerunCount,
      advertPackage.bonusesRerunCount,
      advertPackage.description,
    );
    const created = await this.create(pkgEntity);
    return { advertPackage: created, version: versionEntity };
  }

  async createMany(advertPackages: Omit<AdvertPackageEntity, 'id'>[]): Promise<AdvertPackageEntity[]> {
    const entities = advertPackages.map(advertPackage => AdvertPackageEntity.createInstance(advertPackage.name, advertPackage.nameSlug, advertPackage.mediaPackId, advertPackage.showIds, advertPackage.advertisementsCount, advertPackage.announcementsCount, advertPackage.popUpsCount, advertPackage.bonusesCount, advertPackage.priceBeforeVAT, advertPackage.otherTaxes, advertPackage.finalPrice, advertPackage.isActive, advertPackage.advertisementsRerunCount, advertPackage.announcementsRerunCount, advertPackage.popUpsRerunCount, advertPackage.bonusesRerunCount, advertPackage.description));
    const models = entities.map(entity => entityToModel(entity));
    const data = models.map(({ id: _omit, ...rest }) => rest);

    const saved = await this.prisma.advertPackage.createManyAndReturn({ data });
    return saved.map(model => modelToEntity(model));
  }
}

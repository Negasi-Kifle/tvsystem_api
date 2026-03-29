import { Prisma } from '../generated/client';
import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';
import { AdvertEntity } from '../../../domain/entities/advert.entity';
import { PrismaBaseRepository } from './base.repository';
import { entityToModel, modelToEntity } from '../model_entity_mappers/advert';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForAdvert } from '../where_clauses/advert';

export class AdvertRepository extends PrismaBaseRepository implements IAdvertRepository {
  async create(data: Omit<AdvertEntity, 'id'>): Promise<AdvertEntity> {
    const entity = data as AdvertEntity;
    const row = entityToModel(entity);
    const { id: _omit, ...createData } = row;
    const saved = await this.prisma.advert.create({
      data: createData as Omit<typeof createData, 'id'>,
    });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<AdvertEntity | null> {
    const row = await this.prisma.advert.findUnique({ where: { id } });
    return row ? modelToEntity(row) : null;
  }

  async findMany(query: QueryOptions<AdvertEntity>): Promise<AdvertEntity[]> {
    const where = buildWhereClauseForAdvert(query.filters ?? {});
    const rows = await this.prisma.advert.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(modelToEntity);
  }

  async count(filters?: Partial<AdvertEntity>): Promise<number> {
    return this.prisma.advert.count({ where: buildWhereClauseForAdvert(filters ?? {}) });
  }

  async update(entity: AdvertEntity): Promise<AdvertEntity | null> {
    if (!entity.id) return null;
    const row = entityToModel(entity);
    const slot =
      entity.slot === null
        ? Prisma.DbNull
        : entity.slot?.start && entity.slot?.end
          ? ({
              start: entity.slot.start.toISOString(),
              end: entity.slot.end.toISOString(),
            } as Prisma.InputJsonValue)
          : row.slot;
    const updated = await this.prisma.advert.update({
      where: { id: entity.id },
      data: {
        showId: row.showId,
        customerId: row.customerId,
        broadcastSlotId: row.broadcastSlotId,
        status: row.status,
        slot,
        contractDetails: row.contractDetails,
      },
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<AdvertEntity | null> {
    const row = await this.prisma.advert.delete({ where: { id } });
    return row ? modelToEntity(row) : null;
  }
}

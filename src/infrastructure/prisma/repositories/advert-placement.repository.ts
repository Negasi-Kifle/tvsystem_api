import { Prisma } from '../generated/client';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { PrismaBaseRepository } from './base.repository';
import { entityToModel, modelToEntity } from '../model_entity_mappers/advert-placement';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForAdvertPlacement } from '../where_clauses/advert-placement';

export class AdvertPlacementRepository extends PrismaBaseRepository implements IAdvertPlacementRepository {
  async create(data: Omit<AdvertPlacementEntity, 'id'>): Promise<AdvertPlacementEntity> {
    const entity = data as AdvertPlacementEntity;
    const row = entityToModel(entity);
    const { id: _omit, ...createData } = row;
    const saved = await this.prisma.advertPlacement.create({
      data: createData as Prisma.AdvertPlacementUncheckedCreateInput,
    });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<AdvertPlacementEntity | null> {
    const row = await this.prisma.advertPlacement.findUnique({ where: { id } });
    return row ? modelToEntity(row) : null;
  }

  async findMany(query: QueryOptions<AdvertPlacementEntity>): Promise<AdvertPlacementEntity[]> {
    const where = buildWhereClauseForAdvertPlacement(query.filters ?? {});
    const rows = await this.prisma.advertPlacement.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { date: 'asc' },
    });
    return rows.map(modelToEntity);
  }

  async count(filters?: Partial<AdvertPlacementEntity>): Promise<number> {
    return this.prisma.advertPlacement.count({
      where: buildWhereClauseForAdvertPlacement(filters ?? {}),
    });
  }

  async update(entity: AdvertPlacementEntity): Promise<AdvertPlacementEntity | null> {
    if (!entity.id) return null;
    const row = entityToModel(entity);
    const updated = await this.prisma.advertPlacement.update({
      where: { id: entity.id },
      data: {
        advertSalesId: row.advertSalesId,
        showId: row.showId,
        broadcastSlotId: row.broadcastSlotId,
        date: row.date,
        dateEth: row.dateEth,
        position: row.position,
        spotIndex: row.spotIndex,
        broadcastCode: row.broadcastCode,
        plannedTimeMinutes: row.plannedTimeMinutes,
        actualAirTime: row.actualAirTime,
        durationSeconds: row.durationSeconds,
        status: row.status,
      },
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<AdvertPlacementEntity | null> {
    const row = await this.prisma.advertPlacement.delete({ where: { id } });
    return row ? modelToEntity(row) : null;
  }
}

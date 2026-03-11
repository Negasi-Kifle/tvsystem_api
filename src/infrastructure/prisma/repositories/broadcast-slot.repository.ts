import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { PrismaBaseRepository } from './base.repository';
import { entityToModel, modelToEntity } from '../model_entity_mappers/broadcast-slot';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForBroadcastSlot } from '../where_clauses/broadcast-slot';
import type { BroadcastSlotFilters } from '../../../domain/interfaces/broadcast-slot-filters.interface';

export class BroadcastSlotRepository
  extends PrismaBaseRepository
  implements IBroadcastSlotRepository
{
  async create(data: Omit<BroadcastSlotEntity, 'id'>): Promise<BroadcastSlotEntity> {
    const model = entityToModel(data as BroadcastSlotEntity);
    const { id: _omit, ...createData } = model;
    const saved = await this.prisma.broadcastSlot.create({ data: createData });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<BroadcastSlotEntity | null> {
    const slot = await this.prisma.broadcastSlot.findUnique({ where: { id }, include: { scheduleBlock: true, schedule: true, show: true } });
    return slot ? modelToEntity(slot) : null;
  }

  async findMany(
    query: QueryOptions<BroadcastSlotEntity, BroadcastSlotFilters>,
  ): Promise<BroadcastSlotEntity[]> {
    const where = buildWhereClauseForBroadcastSlot(query.filters ?? {});
    const slots = await this.prisma.broadcastSlot.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 200,
      orderBy: [{ date: 'asc' }, { startTimeMinutes: 'asc' }],
      include: { scheduleBlock: true, schedule: true, show: true },
    });
    return slots.map(modelToEntity);
  }

  async update(entity: BroadcastSlotEntity): Promise<BroadcastSlotEntity | null> {
    const updated = await this.prisma.broadcastSlot.update({
      where: { id: entity.id },
      data: entityToModel(entity),
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<BroadcastSlotEntity | null> {
    const slot = await this.prisma.broadcastSlot.delete({ where: { id } });
    return modelToEntity(slot);
  }

  async count(filters?: Partial<BroadcastSlotEntity>): Promise<number> {
    return this.prisma.broadcastSlot.count({
      where: buildWhereClauseForBroadcastSlot((filters ?? {}) as BroadcastSlotFilters),
    });
  }

  async findByScheduleAndDateRange(
    scheduleId: string,
    from: Date,
    to: Date,
  ): Promise<BroadcastSlotEntity[]> {
    const slots = await this.prisma.broadcastSlot.findMany({
      where: {
        scheduleId,
        date: { gte: from, lte: to },
      },
      orderBy: [{ date: 'asc' }, { startTimeMinutes: 'asc' }],
      include: { scheduleBlock: true, schedule: true, show: true },
    });
    return slots.map(modelToEntity);
  }

  async createMany(entities: BroadcastSlotEntity[]): Promise<{ count: number }> {
    const data = entities.map((e) => {
      const model = entityToModel(e);
      const { id: _omit, ...createData } = model;
      return createData;
    });
    return this.prisma.broadcastSlot.createMany({ data });
  }

  async existsByBlockAndDate(scheduleBlockId: string, date: Date): Promise<boolean> {
    const count = await this.prisma.broadcastSlot.count({
      where: { scheduleBlockId, date },
    });
    return count > 0;
  }
}

import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { DayOfWeek } from '../../../domain/enums/day-of-week.enum';
import { PrismaBaseRepository } from './base.repository';
import { entityToModel, modelToEntity } from '../model_entity_mappers/schedule-block';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForScheduleBlock } from '../where_clauses/schedule-block';
import type { ScheduleBlockFilters } from '../../../domain/interfaces/schedule-block-filters.interface';

export class ScheduleBlockRepository
  extends PrismaBaseRepository
  implements IScheduleBlockRepository
{
  async create(data: Omit<ScheduleBlockEntity, 'id'>): Promise<ScheduleBlockEntity> {
    const model = entityToModel(data as ScheduleBlockEntity);
    const { id: _omit, ...createData } = model;
    const saved = await this.prisma.satelliteScheduleBlock.create({ data: createData });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<ScheduleBlockEntity | null> {
    const block = await this.prisma.satelliteScheduleBlock.findUnique({ where: { id } });
    return block ? modelToEntity(block) : null;
  }

  async findMany(
    query: QueryOptions<ScheduleBlockEntity, ScheduleBlockFilters>,
  ): Promise<ScheduleBlockEntity[]> {
    const where = buildWhereClauseForScheduleBlock(query.filters ?? {});
    const blocks = await this.prisma.satelliteScheduleBlock.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 200,
      orderBy: [{ dayOfWeek: 'asc' }, { startTimeMinutes: 'asc' }],
    });
    return blocks.map(modelToEntity);
  }

  async update(entity: ScheduleBlockEntity): Promise<ScheduleBlockEntity | null> {
    const updated = await this.prisma.satelliteScheduleBlock.update({
      where: { id: entity.id },
      data: entityToModel(entity),
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<ScheduleBlockEntity | null> {
    const block = await this.prisma.satelliteScheduleBlock.delete({ where: { id } });
    return modelToEntity(block);
  }

  async count(filters?: Partial<ScheduleBlockEntity>): Promise<number> {
    return this.prisma.satelliteScheduleBlock.count({
      where: buildWhereClauseForScheduleBlock((filters ?? {}) as ScheduleBlockFilters),
    });
  }

  async findByScheduleAndDay(
    scheduleId: string,
    dayOfWeek: DayOfWeek,
  ): Promise<ScheduleBlockEntity[]> {
    const blocks = await this.prisma.satelliteScheduleBlock.findMany({
      where: { scheduleId, dayOfWeek },
      orderBy: { startTimeMinutes: 'asc' },
    });
    return blocks.map(modelToEntity);
  }

  async createMany(entities: ScheduleBlockEntity[]): Promise<{ count: number }> {
    const data = entities.map((e) => {
      const model = entityToModel(e);
      const { id: _omit, ...createData } = model;
      return createData;
    });
    return this.prisma.satelliteScheduleBlock.createMany({ data });
  }
}

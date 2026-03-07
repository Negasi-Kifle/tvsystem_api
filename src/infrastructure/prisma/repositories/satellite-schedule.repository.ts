import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { PrismaBaseRepository } from './base.repository';
import { entityToModel, modelToEntity } from '../model_entity_mappers/satellite-schedule';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForSatelliteSchedule } from '../where_clauses/satellite-schedule';
import type { SatelliteScheduleFilters } from '../../../domain/interfaces/satellite-schedule-filters.interface';

export class SatelliteScheduleRepository
  extends PrismaBaseRepository
  implements ISatelliteScheduleRepository
{
  async create(data: Omit<SatelliteScheduleEntity, 'id'>): Promise<SatelliteScheduleEntity> {
    const model = entityToModel(data as SatelliteScheduleEntity);
    const { id: _omit, ...createData } = model;
    const saved = await this.prisma.satelliteSchedule.create({ data: createData });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<SatelliteScheduleEntity | null> {
    const schedule = await this.prisma.satelliteSchedule.findUnique({ where: { id } });
    return schedule ? modelToEntity(schedule) : null;
  }

  async findMany(
    query: QueryOptions<SatelliteScheduleEntity, SatelliteScheduleFilters>,
  ): Promise<SatelliteScheduleEntity[]> {
    const where = buildWhereClauseForSatelliteSchedule(query.filters ?? {});
    const schedules = await this.prisma.satelliteSchedule.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
    });
    return schedules.map(modelToEntity);
  }

  async update(entity: SatelliteScheduleEntity): Promise<SatelliteScheduleEntity | null> {
    const updated = await this.prisma.satelliteSchedule.update({
      where: { id: entity.id },
      data: entityToModel(entity),
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<SatelliteScheduleEntity | null> {
    const schedule = await this.prisma.satelliteSchedule.delete({ where: { id } });
    return modelToEntity(schedule);
  }

  async count(filters?: Partial<SatelliteScheduleEntity>): Promise<number> {
    return this.prisma.satelliteSchedule.count({
      where: buildWhereClauseForSatelliteSchedule((filters ?? {}) as SatelliteScheduleFilters),
    });
  }

  async findByNameSlug(nameSlug: string): Promise<SatelliteScheduleEntity | null> {
    const schedule = await this.prisma.satelliteSchedule.findUnique({ where: { nameSlug } });
    return schedule ? modelToEntity(schedule) : null;
  }
}

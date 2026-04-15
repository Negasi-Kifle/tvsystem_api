import { PrismaBaseRepository } from './base.repository';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import type { MediaMonitoringRecordFilters } from '../../../domain/types/media-monitoring-record-filters';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/media-monitoring-record';
import { buildWhereClauseForMediaMonitoringRecord } from '../where_clauses/media-monitoring-record';

export class MediaMonitoringRecordRepository
  extends PrismaBaseRepository
  implements IMediaMonitoringRecordRepository
{
  async findById(id: string): Promise<MediaMonitoringRecordEntity | null> {
    const record = await this.prisma.mediaMonitoringRecord.findUnique({ where: { id } });
    return record ? modelToEntity(record) : null;
  }

  async findUnlinked(): Promise<MediaMonitoringRecordEntity[]> {
    const records = await this.prisma.mediaMonitoringRecord.findMany({
      where: { customerId: null },
      orderBy: { monitoringDate: 'desc' },
    });
    return records.map(modelToEntity);
  }

  async updateStatusByCustomerId(customerId: string, statusWithUs: string): Promise<number> {
    const result = await this.prisma.mediaMonitoringRecord.updateMany({
      where: { customerId },
      data: { statusWithUs },
    });
    return result.count;
  }

  async findMany(
    query: QueryOptions<MediaMonitoringRecordEntity, MediaMonitoringRecordFilters>,
  ): Promise<MediaMonitoringRecordEntity[]> {
    const where = buildWhereClauseForMediaMonitoringRecord(query.filters ?? {});
    const list = await this.prisma.mediaMonitoringRecord.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { monitoringDate: 'desc' },
    });
    return list.map(modelToEntity);
  }

  async count(filters?: MediaMonitoringRecordFilters): Promise<number> {
    const where = buildWhereClauseForMediaMonitoringRecord(filters ?? {});
    return this.prisma.mediaMonitoringRecord.count({ where });
  }

  async create(data: Omit<MediaMonitoringRecordEntity, 'id'>): Promise<MediaMonitoringRecordEntity> {
    const entity = data as MediaMonitoringRecordEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.mediaMonitoringRecord.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(entity: MediaMonitoringRecordEntity): Promise<MediaMonitoringRecordEntity | null> {
    if (!entity.id) return null;
    const updateData = entityToModel(entity);
    const { id: _omit, ...rest } = updateData;
    const updated = await this.prisma.mediaMonitoringRecord.update({
      where: { id: entity.id },
      data: rest,
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<MediaMonitoringRecordEntity | null> {
    try {
      const deleted = await this.prisma.mediaMonitoringRecord.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }
}

import { MediaMonitoringRecordEntity } from '../entities/media-monitoring-record.entity';
import type { MediaMonitoringRecordFilters } from '../types/media-monitoring-record-filters';
import type { QueryOptions } from '../interfaces/query-options.interface';
import { IBaseRepository } from './base.repository.interface';

export interface IMediaMonitoringRecordRepository extends IBaseRepository<MediaMonitoringRecordEntity> {
  findMany(
    query: QueryOptions<MediaMonitoringRecordEntity, MediaMonitoringRecordFilters>,
  ): Promise<MediaMonitoringRecordEntity[]>;
  count(filters?: MediaMonitoringRecordFilters): Promise<number>;
  findUnlinked(): Promise<MediaMonitoringRecordEntity[]>;
  updateStatusByCustomerId(customerId: string, statusWithAbbay: string): Promise<number>;
}

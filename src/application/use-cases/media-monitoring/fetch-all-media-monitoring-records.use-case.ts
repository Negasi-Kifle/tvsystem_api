import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import type { MediaMonitoringRecordFilters } from '../../../domain/types/media-monitoring-record-filters';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchAllMediaMonitoringRecordsUseCase {
  constructor(private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository) {}

  async execute(
    query: QueryOptions<MediaMonitoringRecordEntity, MediaMonitoringRecordFilters>,
  ): Promise<MediaMonitoringRecordEntity[]> {
    return this.mediaMonitoringRepo.findMany(query);
  }
}

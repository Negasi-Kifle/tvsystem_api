import type { MediaMonitoringRecordFilters } from '../../../domain/types/media-monitoring-record-filters';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';

export class CountMediaMonitoringRecordsUseCase {
  constructor(private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository) {}

  async execute(filters?: MediaMonitoringRecordFilters): Promise<number> {
    return this.mediaMonitoringRepo.count(filters);
  }
}

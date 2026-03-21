import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';

export class FetchUnlinkedMediaMonitoringUseCase {
  constructor(private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository) {}

  async execute(): Promise<MediaMonitoringRecordEntity[]> {
    return this.mediaMonitoringRepo.findUnlinked();
  }
}

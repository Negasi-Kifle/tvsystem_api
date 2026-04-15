import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';

export class GetMediaMonitoringRecordByIdUseCase {
  constructor(private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository) {}

  async execute(id: string): Promise<MediaMonitoringRecordEntity> {
    const record = await this.mediaMonitoringRepo.findById(id);
    if (!record) {
      throw new EntityNotFoundError('Media monitoring record not found', 'MediaMonitoringRecord', id);
    }
    return record;
  }
}

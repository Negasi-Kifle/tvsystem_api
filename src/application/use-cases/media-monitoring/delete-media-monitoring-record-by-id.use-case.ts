import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';

export class DeleteMediaMonitoringRecordByIdUseCase {
  constructor(private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.mediaMonitoringRepo.deleteById(id);
    if (!deleted) {
      throw new EntityNotFoundError('Media monitoring record not found', 'MediaMonitoringRecord', id);
    }
  }
}

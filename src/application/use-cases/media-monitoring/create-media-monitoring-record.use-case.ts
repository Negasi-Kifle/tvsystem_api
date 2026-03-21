import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';

export type CreateMediaMonitoringRecordInput = {
  channel: string;
  sponsorName: string;
  monitoringDate: Date;
  showName?: string;
  timeSlot?: string;
  statusWithAbbay?: string;
  contactInfo?: string;
  programName?: string;
};

export class CreateMediaMonitoringRecordUseCase {
  constructor(private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository) {}

  async execute(payload: CreateMediaMonitoringRecordInput): Promise<MediaMonitoringRecordEntity> {
    const record = MediaMonitoringRecordEntity.createInstance(
      payload.channel,
      payload.sponsorName,
      payload.monitoringDate,
      payload.showName,
      payload.timeSlot,
      payload.statusWithAbbay,
      payload.contactInfo,
      payload.programName,
    );

    return this.mediaMonitoringRepo.create(record);
  }
}

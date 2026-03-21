import { MediaMonitoringRecordEntity } from '../entities/media-monitoring-record.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IMediaMonitoringRecordRepository extends IBaseRepository<MediaMonitoringRecordEntity> {
  findUnlinked(): Promise<MediaMonitoringRecordEntity[]>;
  updateStatusByCustomerId(customerId: string, statusWithAbbay: string): Promise<number>;
}

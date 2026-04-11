import { SatelliteLogEntryEntity } from '../entities/satellite-log-entry.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ISatelliteLogEntryRepository extends IBaseRepository<SatelliteLogEntryEntity> {
  createMany(entities: SatelliteLogEntryEntity[]): Promise<{ count: number }>;
  findByUploadId(uploadId: string): Promise<SatelliteLogEntryEntity[]>;
}

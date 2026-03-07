import { SatelliteScheduleEntity } from '../entities/satellite-schedule.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ISatelliteScheduleRepository extends IBaseRepository<SatelliteScheduleEntity> {
  findByNameSlug(nameSlug: string): Promise<SatelliteScheduleEntity | null>;
}

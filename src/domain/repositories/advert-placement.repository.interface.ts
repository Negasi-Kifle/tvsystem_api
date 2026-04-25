import { AdvertPlacementEntity } from '../entities/advert-placement.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IAdvertPlacementRepository extends IBaseRepository<AdvertPlacementEntity> {
  findPlacementsNeedingAirAlert(now: Date, windowEnd: Date): Promise<AdvertPlacementEntity[]>;
  /** Count of placements currently in SCHEDULED status. */
  countScheduledNow(): Promise<number>;
  /** Count of placements created within [from, to] (used for month-over-month delta). */
  countCreatedInRange(from: Date, to: Date): Promise<number>;
}

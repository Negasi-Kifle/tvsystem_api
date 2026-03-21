import { ShowSegmentSlotEntity } from '../entities/show-segment-slot.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IShowSegmentSlotRepository extends IBaseRepository<ShowSegmentSlotEntity> {
  findByShowId(showId: string): Promise<ShowSegmentSlotEntity[]>;
}

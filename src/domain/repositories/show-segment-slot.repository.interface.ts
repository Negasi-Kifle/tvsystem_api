import { ShowSegmentSlotEntity } from '../entities/show-segment-slot.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IShowSegmentSlotRepository extends IBaseRepository<ShowSegmentSlotEntity> {
  findByShowAndCustomer(showId: string, customerId: string): Promise<ShowSegmentSlotEntity | null>;
}

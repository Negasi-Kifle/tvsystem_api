import { ShowSegmentSlotEntity } from '../entities/show-segment-slot.entity';

export type ShowSegmentSlotFilters = Partial<ShowSegmentSlotEntity> & {
  showId?: string;
  customerId?: string;
};

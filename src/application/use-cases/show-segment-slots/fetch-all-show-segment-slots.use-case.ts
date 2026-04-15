import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { ShowSegmentSlotFilters } from '../../../domain/interfaces/show-segment-slot-filters.interface';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';

export class FetchAllShowSegmentSlotsUseCase {
  constructor(private readonly showSegmentSlotRepo: IShowSegmentSlotRepository) {}

  async execute(query: QueryOptions<ShowSegmentSlotEntity, ShowSegmentSlotFilters>): Promise<ShowSegmentSlotEntity[]> {
    return this.showSegmentSlotRepo.findMany(query);
  }
}

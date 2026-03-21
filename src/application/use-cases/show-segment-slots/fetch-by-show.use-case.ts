import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';

export class FetchShowSegmentSlotsByShowUseCase {
  constructor(private readonly showSegmentSlotRepo: IShowSegmentSlotRepository) {}

  async execute(showId: string): Promise<ShowSegmentSlotEntity[]> {
    return this.showSegmentSlotRepo.findByShowId(showId);
  }
}

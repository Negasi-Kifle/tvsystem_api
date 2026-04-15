import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';

export class DeleteShowSegmentSlotUseCase {
  constructor(private readonly showSegmentSlotRepo: IShowSegmentSlotRepository) {}

  async execute(id: string): Promise<ShowSegmentSlotEntity | null> {
    const existing = await this.showSegmentSlotRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Show segment slot not found', 'ShowSegmentSlot', id);
    }
    return this.showSegmentSlotRepo.deleteById(id);
  }
}

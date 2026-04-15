import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';

export class GetShowSegmentSlotByIdUseCase {
  constructor(private readonly showSegmentSlotRepo: IShowSegmentSlotRepository) {}

  async execute(id: string): Promise<ShowSegmentSlotEntity> {
    const entity = await this.showSegmentSlotRepo.findById(id);
    if (!entity) {
      throw new EntityNotFoundError('Show segment slot not found', 'ShowSegmentSlot', id);
    }
    return entity;
  }
}

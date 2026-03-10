import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';

export class GetBroadcastSlotByIdUseCase {
  constructor(private readonly slotRepo: IBroadcastSlotRepository) {}

  async execute(id: string): Promise<BroadcastSlotEntity> {
    const slot = await this.slotRepo.findById(id);
    if (!slot) {
      throw new EntityNotFoundError('Broadcast slot not found', 'BroadcastSlot', id);
    }
    return slot;
  }
}

import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotStatus } from '../../../domain/enums';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';

export class DeleteBroadcastSlotUseCase {
  constructor(private readonly slotRepo: IBroadcastSlotRepository) {}

  async execute(id: string): Promise<BroadcastSlotEntity | null> {
    const slot = await this.slotRepo.findById(id);
    if (!slot) {
      throw new EntityNotFoundError('Broadcast slot not found', 'BroadcastSlot', id);
    }

    if (slot.status !== BroadcastSlotStatus.Scheduled) {
      throw new ValidationError(
        `Can only delete slots with status SCHEDULED, current status is ${slot.status}`,
      );
    }

    return this.slotRepo.deleteById(id);
  }
}

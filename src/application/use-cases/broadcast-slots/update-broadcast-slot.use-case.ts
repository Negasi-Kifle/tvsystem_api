import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotStatus } from '../../../domain/enums';
import { EntityNotFoundError } from '../../../domain/errors';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { EthiopianTime, EthiopianDayPart } from '../../../domain/value-objects/ethiopian-time.value-objects';

export type UpdateBroadcastSlotInput = {
  status?: BroadcastSlotStatus;
  hour?: number;
  minute?: number;
  dayPart?: EthiopianDayPart;
  durationMinutes?: number;
  label?: string | null;
  overrideReason?: string | null;
};

export class UpdateBroadcastSlotUseCase {
  constructor(private readonly slotRepo: IBroadcastSlotRepository) {}

  async execute(id: string, input: UpdateBroadcastSlotInput): Promise<BroadcastSlotEntity> {
    const slot = await this.slotRepo.findById(id);
    if (!slot) {
      throw new EntityNotFoundError('Broadcast slot not found', 'BroadcastSlot', id);
    }

    let startTimeMinutes: number | undefined;
    if (input.hour !== undefined && input.minute !== undefined && input.dayPart !== undefined) {
      startTimeMinutes = EthiopianTime.toGregorianMinutes(input.hour, input.minute, input.dayPart);
    }

    slot.updateInstance(
      startTimeMinutes,
      input.durationMinutes,
      input.status,
      input.label,
      input.overrideReason,
    );

    return (await this.slotRepo.update(slot))!;
  }
}

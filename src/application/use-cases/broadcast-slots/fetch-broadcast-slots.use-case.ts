import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotFilters } from '../../../domain/interfaces/broadcast-slot-filters.interface';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchBroadcastSlotsUseCase {
  constructor(private readonly slotRepo: IBroadcastSlotRepository) {}

  async execute(
    query: QueryOptions<BroadcastSlotEntity, BroadcastSlotFilters>,
  ): Promise<BroadcastSlotEntity[]> {
    return this.slotRepo.findMany(query);
  }
}

import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotFilters } from '../../../domain/interfaces/broadcast-slot-filters.interface';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { BroadcastSlotGroupBy } from '../../../presentation/dtos/requests/broadcast-slot/fetch-broadcast-slots.dto';

export type BroadcastSlotGroup = {
  key: string;
  slots: BroadcastSlotEntity[];
};

export type GroupedBroadcastSlots = {
  groupBy: BroadcastSlotGroupBy;
  groups: BroadcastSlotGroup[];
};

export class FetchBroadcastSlotsUseCase {
  constructor(private readonly slotRepo: IBroadcastSlotRepository) {}

  async execute(
    query: QueryOptions<BroadcastSlotEntity, BroadcastSlotFilters, BroadcastSlotGroupBy>,
  ): Promise<BroadcastSlotEntity[] | GroupedBroadcastSlots> {
    const slots = await this.slotRepo.findMany(query);
    if (!query.groupBy) return slots;

    const groupsMap = new Map<string, BroadcastSlotEntity[]>();
    for (const slot of slots) {
      const key = this.getGroupKey(slot, query.groupBy);
      const group = groupsMap.get(key) ?? [];
      group.push(slot);
      groupsMap.set(key, group);
    }

    return {
      groupBy: query.groupBy,
      groups: Array.from(groupsMap.entries()).map(([key, groupedSlots]) => ({
        key,
        slots: groupedSlots,
      })),
    };
  }

  private getGroupKey(slot: BroadcastSlotEntity, groupBy: BroadcastSlotGroupBy): string {
    if (groupBy === 'date') return slot.date.toISOString();
    if (groupBy === 'dateEth') return slot.dateEth;
    return slot.showId;
  }
}

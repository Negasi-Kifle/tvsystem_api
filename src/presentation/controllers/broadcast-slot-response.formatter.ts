import type { BroadcastSlotEntity } from '../../domain/entities/broadcast-slot.entity';
import type { GroupedBroadcastSlots } from '../../application/use-cases/broadcast-slots/fetch-broadcast-slots.use-case';

export function formatSlotResponse(slot: BroadcastSlotEntity) {
  return {
    id: slot.id,
    scheduleBlockId: slot.scheduleBlockId,
    scheduleId: slot.scheduleId,
    showId: slot.showId,
    date: slot.date,
    dateEth: slot.dateEth,
    dayOfWeek: slot.dayOfWeek,
    broadcastType: slot.broadcastType,
    status: slot.status,
    label: slot.label,
    overrideReason: slot.overrideReason,
    startTimeMinutes: slot.startTimeMinutes,
    durationMinutes: slot.durationMinutes,
    gregorian: {
      start: slot.startTimeGregorian,
      end: slot.endTimeGregorian,
    },
    ethiopian: {
      start: slot.startTimeEthiopian.toString(),
      end: slot.endTimeEthiopian.toString(),
    },
    createdAt: slot.createdAt,
    updatedAt: slot.updatedAt,
    scheduleBlock: slot.scheduleBlock,
    schedule: slot.schedule,
    show: slot.show,
  };
}

export function formatListBroadcastSlotsData(slots: BroadcastSlotEntity[] | GroupedBroadcastSlots) {
  if (Array.isArray(slots)) {
    return { slots: slots.map(formatSlotResponse) };
  }

  return {
    groupBy: slots.groupBy,
    groups: slots.groups.map((group) => ({
      key: group.key,
      slots: group.slots.map(formatSlotResponse),
    })),
  };
}

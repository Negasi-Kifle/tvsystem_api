import { BroadcastSlot } from '../generated/client';
import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotStatus } from '../../../domain/enums/broadcast-slot-status.enum';
import { BroadcastType } from '../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../domain/enums/day-of-week.enum';

export function modelToEntity(slot: BroadcastSlot): BroadcastSlotEntity {
  return BroadcastSlotEntity.createInstance(
    slot.scheduleBlockId,
    slot.scheduleId,
    slot.showId,
    slot.date,
    slot.dateEth,
    slot.dayOfWeek as DayOfWeek,
    slot.startTimeMinutes,
    slot.durationMinutes,
    slot.broadcastType as BroadcastType,
    slot.status as BroadcastSlotStatus,
    slot.label ?? undefined,
    slot.overrideReason ?? undefined,
    slot.id,
    slot.createdAt,
    slot.updatedAt,
  );
}

export function entityToModel(entity: BroadcastSlotEntity): BroadcastSlot {
  return {
    id: entity.id ?? '',
    scheduleBlockId: entity.scheduleBlockId,
    scheduleId: entity.scheduleId,
    showId: entity.showId,
    date: entity.date,
    dateEth: entity.dateEth,
    dayOfWeek: entity.dayOfWeek,
    startTimeMinutes: entity.startTimeMinutes,
    durationMinutes: entity.durationMinutes,
    broadcastType: entity.broadcastType,
    label: entity.label ?? null,
    status: entity.status,
    overrideReason: entity.overrideReason ?? null,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

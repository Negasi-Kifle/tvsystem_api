import { BroadcastSlot } from '../generated/client';
import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotStatus } from '../../../domain/enums/broadcast-slot-status.enum';
import { BroadcastType } from '../../../domain/enums/broadcast-type.enum';
import { DayOfWeek } from '../../../domain/enums/day-of-week.enum';
import { Prisma } from '../generated/client';
import { modelToEntity as mapScheduleBlockToEntity } from './schedule-block';
import { modelToEntity as mapSatelliteScheduleToEntity } from './satellite-schedule';
import { modelToEntity as mapShowToEntity } from './show';
import { modelToEntity as mapAdvertPlacementToEntity } from './advert-placement';

type BroadcastSlotWithRelations = Prisma.BroadcastSlotGetPayload<{
  include: { scheduleBlock: true; schedule: true; show: true; advertPlacements: true };
}>;

type BroadcastSlotLike = Prisma.BroadcastSlotGetPayload<{}> | BroadcastSlotWithRelations;

export function modelToEntity(slot: BroadcastSlotLike): BroadcastSlotEntity {
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
    'scheduleBlock' in slot && slot.scheduleBlock ? mapScheduleBlockToEntity(slot.scheduleBlock) : undefined,
    'schedule' in slot && slot.schedule ? mapSatelliteScheduleToEntity(slot.schedule) : undefined,
    'show' in slot && slot.show ? mapShowToEntity(slot.show) : undefined,
    'advertPlacements' in slot && slot.advertPlacements ? slot.advertPlacements.map(mapAdvertPlacementToEntity) : undefined,
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

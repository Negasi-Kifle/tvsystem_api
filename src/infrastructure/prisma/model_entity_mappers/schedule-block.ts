import { SatelliteScheduleBlock } from '../generated/client';
import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { DayOfWeek } from '../../../domain/enums/day-of-week.enum';
import { BroadcastType } from '../../../domain/enums/broadcast-type.enum';
import { showModelToSummary } from './show';
import { modelToEntity as mapSatelliteScheduleToEntity } from './satellite-schedule';
import { modelToEntity as mapBroadcastSlotToEntity } from './broadcast-slot';
import { Prisma } from '../generated/client';

type SatelliteScheduleBlockWithRelations = Prisma.SatelliteScheduleBlockGetPayload<{
  include: { show: true; schedule: true, broadcastSlots: true };
}>;

type SatelliteScheduleBlockLike = Prisma.SatelliteScheduleBlockGetPayload<{}> | SatelliteScheduleBlockWithRelations;

export function modelToEntity(block: SatelliteScheduleBlockLike): ScheduleBlockEntity {
  return ScheduleBlockEntity.createInstance(
    block.showId,
    block.scheduleId,
    block.dayOfWeek as DayOfWeek,
    block.startTimeMinutes,
    block.durationMinutes,
    block.broadcastType as BroadcastType,
    block.label ?? undefined,
    block.id,
    block.createdAt,
    block.updatedAt,
    'show' in block && block.show ? showModelToSummary(block.show) : undefined,
    'schedule' in block && block.schedule ? mapSatelliteScheduleToEntity(block.schedule) : undefined,
    'broadcastSlots' in block && block.broadcastSlots ? block.broadcastSlots.map(mapBroadcastSlotToEntity) : undefined,
  );
} 

export function entityToModel(entity: ScheduleBlockEntity): SatelliteScheduleBlock {
  return {
    id: entity.id ?? '',
    scheduleId: entity.scheduleId,
    showId: entity.showId,
    dayOfWeek: entity.dayOfWeek,
    startTimeMinutes: entity.startTimeMinutes,
    durationMinutes: entity.durationMinutes,
    broadcastType: entity.broadcastType,
    label: entity.label ?? null,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

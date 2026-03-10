import { SatelliteScheduleBlock } from '@prisma/client';
import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { DayOfWeek } from '../../../domain/enums/day-of-week.enum';
import { BroadcastType } from '../../../domain/enums/broadcast-type.enum';

export function modelToEntity(block: SatelliteScheduleBlock): ScheduleBlockEntity {
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

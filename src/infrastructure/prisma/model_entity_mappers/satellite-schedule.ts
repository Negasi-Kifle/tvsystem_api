import { SatelliteSchedule } from '@prisma/client';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';

export function modelToEntity(schedule: SatelliteSchedule): SatelliteScheduleEntity {
  return SatelliteScheduleEntity.createInstance(
    schedule.name,
    schedule.nameSlug,
    schedule.effectiveFrom,
    schedule.effectiveTo,
    schedule.scheduleType as SatelliteScheduleType,
    schedule.status as SatelliteScheduleStatus,
    schedule.id,
    schedule.effectiveFromEth ?? undefined,
    schedule.effectiveToEth ?? undefined,
    schedule.createdAt,
    schedule.updatedAt,
  );
}

export function entityToModel(schedule: SatelliteScheduleEntity): SatelliteSchedule {
  return {
    id: schedule.id ?? '',
    name: schedule.name,
    nameSlug: schedule.nameSlug,
    effectiveFrom: schedule.effectiveFrom,
    effectiveTo: schedule.effectiveTo,
    status: schedule.status,
    scheduleType: schedule.scheduleType,
    effectiveFromEth: schedule.effectiveFromEth ?? null,
    effectiveToEth: schedule.effectiveToEth ?? null,
    createdAt: schedule.createdAt ?? new Date(),
    updatedAt: schedule.updatedAt ?? new Date(),
  };
}

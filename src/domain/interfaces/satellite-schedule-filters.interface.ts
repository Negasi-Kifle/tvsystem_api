import { SatelliteScheduleEntity } from '../entities/satellite-schedule.entity';
import { SatelliteScheduleStatus } from '../enums/satellite-schedule-status.enum';
import { SatelliteScheduleType } from '../enums/satellite-schedule-type.enum';

export type SatelliteScheduleFilters = Partial<SatelliteScheduleEntity> & {
  name?: string;
  nameSlug?: string;
  status?: SatelliteScheduleStatus;
  scheduleType?: SatelliteScheduleType;
  effectiveFromAfter?: Date;
  effectiveFromBefore?: Date;
  effectiveToAfter?: Date;
  effectiveToBefore?: Date;
};

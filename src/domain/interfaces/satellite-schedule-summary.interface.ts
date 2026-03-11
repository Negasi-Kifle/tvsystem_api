import { SatelliteScheduleStatus } from "../enums/satellite-schedule-status.enum";
import { SatelliteScheduleType } from "../enums/satellite-schedule-type.enum";

export interface SatelliteScheduleSummary {
    name: string;
    nameSlug: string;
    effectiveFrom: Date;
    effectiveTo: Date;
    status: SatelliteScheduleStatus;
    scheduleType: SatelliteScheduleType;
}
import { z } from 'zod';
import { SatelliteScheduleType } from '../../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../../domain/enums/satellite-schedule-status.enum';

export const fetchAllSatelliteSchedulesDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional(),
  nameSlug: z.string().optional(),
  status: z.enum(SatelliteScheduleStatus).optional(),
  scheduleType: z.enum(SatelliteScheduleType, "Schedule type must be one of : " + Object.values(SatelliteScheduleType).join(', ')).optional(),
  effectiveFromAfter: z.coerce.date().optional(),
  effectiveFromBefore: z.coerce.date().optional(),
  effectiveToAfter: z.coerce.date().optional(),
  effectiveToBefore: z.coerce.date().optional(),
});

export type FetchAllSatelliteSchedulesDto = z.infer<typeof fetchAllSatelliteSchedulesDto>;

import { z } from 'zod';
import { SatelliteScheduleType } from '../../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../../domain/enums/satellite-schedule-status.enum';

export const updateSatelliteScheduleDto = z.object({
  name: z.string().min(2).optional(),
  nameSlug: z.string().optional(),
  effectiveFrom: z.coerce.date().optional(),
  effectiveTo: z.coerce.date().optional(),
  scheduleType: z.enum(SatelliteScheduleType, "Schedule type must be one of : " + Object.values(SatelliteScheduleType).join(', ')).optional(),
  status: z.enum(SatelliteScheduleStatus).optional(),
}).refine(
  (data) => {
    if (data.effectiveFrom != null && data.effectiveTo != null) {
      return data.effectiveTo > data.effectiveFrom;
    }
    return true;
  },
  { message: 'effectiveTo must be after effectiveFrom', path: ['effectiveTo'] },
);

export type UpdateSatelliteScheduleDto = z.infer<typeof updateSatelliteScheduleDto>;

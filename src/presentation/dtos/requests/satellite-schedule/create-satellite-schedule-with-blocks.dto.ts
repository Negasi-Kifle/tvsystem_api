import { z } from 'zod';
import { SatelliteScheduleType } from '../../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../../domain/enums/satellite-schedule-status.enum';
import { createScheduleBlockDto } from '../satellite-schedule-block/create-satellite-schedule-block.dto';

export const createSatelliteScheduleWithBlocksDto = z.object({
  name: z.string().min(2),
  nameSlug: z.string().optional(),
  effectiveFrom: z.coerce.date(),
  effectiveTo: z.coerce.date(),
  scheduleType: z.enum(SatelliteScheduleType, "Schedule type is required and must be one of : " + Object.values(SatelliteScheduleType).join(', ')),
  status: z.enum(SatelliteScheduleStatus).optional(),
  blocks: z.array(createScheduleBlockDto),
}).refine((data) => data.effectiveTo > data.effectiveFrom, {
    message: 'effectiveTo must be after effectiveFrom',
    path: ['effectiveTo'],
  })
  .strict();

export type CreateSatelliteScheduleWithBlocksDto = z.infer<typeof createSatelliteScheduleWithBlocksDto>;

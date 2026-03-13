import { z } from 'zod';
import { createScheduleBlockDto } from './create-satellite-schedule-block.dto';

export const createBatchScheduleBlocksDto = z.object({
  blocks: z.array(createScheduleBlockDto).min(1),
});

export type CreateBatchScheduleBlocksDto = z.infer<typeof createBatchScheduleBlocksDto>;

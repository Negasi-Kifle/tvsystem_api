import { z } from 'zod';
import { ShowType } from '../../../domain/enums/show-type.enum';

export const createShowDto = z.object({
  title: z.string().min(2),
  type: z.nativeEnum(ShowType),
  durationMinutes: z.number().min(1),
  maxAdLengthSeconds: z.number().min(1),
  schedule: z
    .array(
      z.object({
        day: z.string(),
        startTime: z.string(),
        endTime: z.string()
      })
    )
    .default([]),
  assignedStaff: z.string().optional()
});

export type CreateShowDto = z.infer<typeof createShowDto>;

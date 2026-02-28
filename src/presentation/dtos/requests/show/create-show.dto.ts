import { z } from 'zod';
import { ShowType } from '../../../../domain/enums/show-type.enum';
import { Status } from '../../../../domain/enums/status';

export const createShowDto = z.object({
  title: z.string().min(2),
  titleSlug: z.string().optional(),
  type: z.enum(ShowType),
  durationMinutes: z.number().min(1),
  maxAdLengthMinutes: z.number().min(1),
  host: z.string().min(1),
  status: z.enum(Status).optional(),
});

export type CreateShowDto = z.infer<typeof createShowDto>;

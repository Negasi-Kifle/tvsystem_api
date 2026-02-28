import { z } from "zod";
import { ShowType } from "../../../../domain/enums/show-type.enum";
import { Status } from "../../../../domain/enums/status";


export const updateShowDto = z.object({
  title: z.string().min(2).optional(),
  titleSlug: z.string().optional(),
  type: z.enum(ShowType).optional(),
  durationMinutes: z.number().min(1).optional(),
  maxAdLengthMinutes: z.number().min(1).optional(),
    host: z.string().min(1).optional(),
  status: z.enum(Status).optional(),
});

export type UpdateShowDto = z.infer<typeof updateShowDto>;  
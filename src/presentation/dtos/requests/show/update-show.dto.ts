import { z } from "zod";
import { ShowType } from "../../../../domain/enums/show-type.enum";
import { Status } from "../../../../domain/enums/status";


export const updateShowDto = z.object({
  title: z.string().min(2).optional(),
  titleSlug: z.string().optional(),
  type: z.enum(ShowType, "Show type must be one of the following: " + Object.values(ShowType).join(', ')).optional(),
  durationMinutes: z.number().min(1).optional(),
  maxAdLengthMinutes: z.number().min(1).optional(),
  partsCount: z.number().int().min(1).optional(),
  rerunsCount: z.number().int().min(0).optional(),
  bonusCount: z.number().int().min(0).optional(),
  colorForScheduleBlock: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Color for schedule block must be a valid hex color. Example: #000000").optional(),
  status: z.enum(Status, "Status must be one of the following: " + Object.values(Status).join(', ')).optional(),
}).strict();

export type UpdateShowDto = z.infer<typeof updateShowDto>;  
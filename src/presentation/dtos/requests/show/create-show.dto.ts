import { z } from 'zod';
import { ShowType } from '../../../../domain/enums/show-type.enum';
import { Status } from '../../../../domain/enums/status';

export const createShowDto = z.object({
  title: z.string("Title must be a string and at least 2 characters long").min(2),
  titleSlug: z.string().optional(),
  type: z.enum(ShowType, "Show type is required and must one of the following: " + Object.values(ShowType).join(', ')),
  durationMinutes: z.number("Duration minutes must be a positive number").min(1),
  maxAdLengthMinutes: z.number("Max ad length minutes must be a positive number").min(1),
  partsCount: z.number("Parts count must be a positive number").min(1, "Parts count must be a positive number"),
  rerunsCount: z.number("Reruns count must be a positive number").min(0, "Reruns count must be a positive number"),
  bonusCount: z.number("Bonus count must be a positive number").min(0, "Bonus count must be a positive number"),
  colorForScheduleBlock: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Color for schedule block must be a valid hex color. Example: #000000").optional(),
  status: z.enum(Status, "Status must be one of the following: " + Object.values(Status).join(', ')).optional(),
}).strict();

export type CreateShowDto = z.infer<typeof createShowDto>;

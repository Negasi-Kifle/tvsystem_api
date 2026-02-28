import z from "zod";
import { ShowType } from "../../../../domain/enums/show-type.enum";
import { Status } from "../../../../domain/enums/status";


export const fetchAllShowsDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  title: z.string().optional(),
  titleSlug: z.string().optional(),
  type: z.enum(ShowType).optional(),
  minDurationMinutes: z.coerce.number().int().optional(),
  maxDurationMinutes: z.coerce.number().int().optional(),
  minAdLengthMinutes: z.coerce.number().int().optional(),
  maxAdLengthMinutes: z.coerce.number().int().optional(),
  host: z.string().optional(),
  status: z.enum(Status).optional(),
});


export type FetchAllShowsDto = z.infer<typeof fetchAllShowsDto>;
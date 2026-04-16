import { z } from 'zod';

export const fetchAllCategoriesDto = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  name: z.string().optional(),
  nameSlug: z.string().optional(),
}).strict();

export type FetchAllCategoriesDto = z.infer<typeof fetchAllCategoriesDto>;
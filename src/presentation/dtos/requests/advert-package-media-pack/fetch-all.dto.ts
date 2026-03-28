import { z } from 'zod';

export const fetchAllAdvertPackageMediaPacksDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  advertPackageId: z.uuid().optional(),
  mediaPackId: z.uuid().optional(),
});

export type FetchAllAdvertPackageMediaPacksDto = z.infer<typeof fetchAllAdvertPackageMediaPacksDto>;

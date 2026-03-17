import { z } from 'zod';

const stringToBoolean = z.string().transform((val) => val === 'true').optional();

export const fetchAllAdvertPackagesDto = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    mediaPackId: z.string().uuid().optional(),
    isActive: stringToBoolean,
    nameSlug: z.string().optional(),
  })
  .strict();

export type FetchAllAdvertPackagesDto = z.infer<typeof fetchAllAdvertPackagesDto>;

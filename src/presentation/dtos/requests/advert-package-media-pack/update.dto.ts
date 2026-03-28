import { z } from 'zod';

export const updateAdvertPackageMediaPackDto = z
  .object({
    advertPackageId: z.uuid().optional(),
    mediaPackId: z.uuid().optional(),
  })
  .refine((data) => data.advertPackageId !== undefined || data.mediaPackId !== undefined, {
    message: 'At least one of advertPackageId or mediaPackId must be provided',
  });

export type UpdateAdvertPackageMediaPackDto = z.infer<typeof updateAdvertPackageMediaPackDto>;

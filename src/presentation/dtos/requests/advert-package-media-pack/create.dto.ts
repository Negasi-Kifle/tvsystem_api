import { z } from 'zod';

export const createAdvertPackageMediaPackDto = z.object({
  mediaPackId: z.uuid('Media pack ID must be a valid UUID'),
  advertPackageIds: z.array(
    z.uuid('Advert package ID must be a valid UUID'),
    { message: 'Advert package IDs must be an array of valid UUIDs' })
    .min(1, 'At least one advert package ID is required'),
}).strict()

export type CreateAdvertPackageMediaPackDto = z.infer<typeof createAdvertPackageMediaPackDto>;

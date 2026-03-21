import { z } from 'zod';

export const createCategoryDto = z
  .object({
    name: z.string().min(1, 'Category name is required'),
    nameSlug: z.string().optional(),
  })
  .strict();

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;

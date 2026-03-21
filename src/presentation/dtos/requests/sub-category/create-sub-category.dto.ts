import { z } from 'zod';

export const createSubCategoryDto = z
  .object({
    categoryId: z.string().uuid(),
    name: z.string().min(1, 'Sub-category name is required'),
    nameSlug: z.string().optional(),
    isCustom: z.boolean().optional().default(true),
  })
  .strict();

export type CreateSubCategoryDto = z.infer<typeof createSubCategoryDto>;

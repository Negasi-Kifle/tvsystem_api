import { z } from 'zod';

export const updateCategoryDto = z
  .object({
    name: z.string().min(1, 'Category name cannot be empty').optional(),
    nameSlug: z.string().min(1, 'nameSlug cannot be empty').optional(),
  })
  .strict()
  .refine((data) => data.name !== undefined || data.nameSlug !== undefined, {
    message: 'At least one of name or nameSlug is required',
  });

export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;

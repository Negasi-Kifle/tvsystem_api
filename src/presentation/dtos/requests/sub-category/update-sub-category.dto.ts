import { z } from 'zod';

export const updateSubCategoryDto = z
  .object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    nameSlug: z.string().min(1, 'nameSlug cannot be empty').optional(),
    isCustom: z.boolean().optional(),
    categoryId: z.uuid('categoryId must be a valid UUID').optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.name !== undefined ||
      data.nameSlug !== undefined ||
      data.isCustom !== undefined ||
      data.categoryId !== undefined,
    { message: 'At least one of name, nameSlug, isCustom, or categoryId is required' },
  );

export type UpdateSubCategoryDto = z.infer<typeof updateSubCategoryDto>;

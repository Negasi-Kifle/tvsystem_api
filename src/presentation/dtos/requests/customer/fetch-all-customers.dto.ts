import { z } from 'zod';

export const fetchAllCustomersDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    businessRef: z.string().optional(),
    name: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    subCategoryId: z.string().uuid().optional(),
    salesAgentId: z.string().uuid().optional(),
    status: z.string().optional(),
    sourceFromMediaMonitoring: z.coerce.boolean().optional(),
  })
  .strict();

export type FetchAllCustomersDto = z.infer<typeof fetchAllCustomersDto>;

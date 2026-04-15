import { z } from 'zod';

export const fetchAllCustomersDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    businessRef: z.string().optional(),
    name: z.string().optional(),
    categoryId: z.uuid().optional(),
    subCategoryId: z.uuid().optional(),
    salesAgentId: z.uuid().optional(),
    status: z.string().optional(),
    sourceFromMediaMonitoring: z.coerce.boolean().optional(),
    mediaMonitoringId: z.uuid().optional(),
  })
  .strict();

export type FetchAllCustomersDto = z.infer<typeof fetchAllCustomersDto>;

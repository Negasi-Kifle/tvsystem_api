import { z } from 'zod';
import { RevenueShareType } from '../../../../domain/enums';

export const fetchAllShowHostsDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  showId: z.string().optional(),
  userId: z.string().optional(),
  revenueShareType: z.enum(RevenueShareType, 'Revenue share type must be one of: ' + Object.values(RevenueShareType).join(', ')).optional(),
  isPrimary: z.coerce.boolean().optional(),
});

export type FetchAllShowHostsDto = z.infer<typeof fetchAllShowHostsDto>;


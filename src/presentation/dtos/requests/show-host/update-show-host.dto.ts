import { z } from 'zod';
import { RevenueShareType } from '../../../../domain/enums';

export const updateShowHostDto = z.object({
  revenueShareType: z.enum(RevenueShareType, 'Revenue share type must be one of: ' + Object.values(RevenueShareType).join(', ')).optional(),
  revenueShareValue: z.number('Revenue share value must be a positive number').min(0, 'Revenue share value must be a positive number').optional(),
  isPrimary: z.boolean().optional(),
});

export type UpdateShowHostDto = z.infer<typeof updateShowHostDto>;


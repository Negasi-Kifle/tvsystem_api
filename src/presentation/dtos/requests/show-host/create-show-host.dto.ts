import { z } from 'zod';
import { RevenueShareType } from '../../../../domain/enums';

export const createShowHostDto = z.object({
  showId: z.string('Show ID is required'),
  userId: z.string('User ID is required'),
  revenueShareType: z.enum(RevenueShareType, 'Revenue share type must be one of: ' + Object.values(RevenueShareType).join(', ')).optional(),
  revenueShareValue: z.number('Revenue share value must be a positive number').min(0, 'Revenue share value must be a positive number').optional(),
  isPrimary: z.boolean().optional(),
});

export type CreateShowHostDto = z.infer<typeof createShowHostDto>;


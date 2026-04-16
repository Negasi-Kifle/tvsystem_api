import { z } from 'zod';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';

export const fetchAllPaymentsDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    advertSalesId: z.uuid().optional(),
    status: z
      .enum(
        PaymentStatus,
        `Status must be one of: ${Object.values(PaymentStatus).join(', ')}`,
      )
      .optional(),
  })
  .strict();

export type FetchAllPaymentsDto = z.infer<typeof fetchAllPaymentsDto>;

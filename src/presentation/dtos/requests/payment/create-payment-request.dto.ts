import { z } from 'zod';

export const createPaymentRequestDto = z
  .object({
    advertSalesId: z.uuid('Advert sales ID must be a valid UUID'),
    installmentNumber: z.number().int().min(1, 'Installment number must be at least 1'),
  })
  .strict();

export type CreatePaymentRequestDto = z.infer<typeof createPaymentRequestDto>;

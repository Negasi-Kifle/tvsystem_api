import { z } from 'zod';

export const generatePaymentRequestDto = z
  .object({
    advertSalesId: z.uuid('Advert sales ID must be a valid UUID'),
  })
  .strict();

export type GeneratePaymentRequestDto = z.infer<typeof generatePaymentRequestDto>;

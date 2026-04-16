import { z } from 'zod';

export const recordPaymentDto = z
  .object({
    bankDeposit: z.coerce.number().finite(),
    paymentDate: z.coerce.date(),
    paymentMethod: z.string().optional(),
    bankDepositDate: z.coerce.date().optional(),
    bankConfirmation: z.string().optional(),
    fsNumber: z.string().optional(),
  })
  .strict();

export type RecordPaymentDto = z.infer<typeof recordPaymentDto>;

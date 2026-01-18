import { z } from 'zod';

export const createPaymentDto = z.object({
  advertId: z.string().min(1),
  installmentLabel: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('ETB'),
  dueDate: z.string().datetime(),
  customerEmail: z.string().email().optional()
});

export type CreatePaymentDto = z.infer<typeof createPaymentDto>;

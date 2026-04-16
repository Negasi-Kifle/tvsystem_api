import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { Prisma } from '../generated/client';

export function buildWhereClauseForPayment(filters: Partial<PaymentEntity>): Prisma.PaymentWhereInput {
  if (!filters) return {};

  return {
    ...(filters.advertSalesId && { advertSalesId: filters.advertSalesId }),
    ...(filters.status && { status: filters.status }),
    ...(filters.installmentNumber !== undefined &&
      filters.installmentNumber !== null && {
        installmentNumber: filters.installmentNumber,
      }),
  };
}

import { Payment, Prisma } from '../generated/client';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { modelToEntity as advertSalesModelToEntity } from './advert-sales';

type PaymentWithRelations = Prisma.PaymentGetPayload<{
  include: { advertSales: { include: { customer: true } } };
}>;

type PaymentLike = Prisma.PaymentGetPayload<{}> | PaymentWithRelations;

export function modelToEntity(model: PaymentLike): PaymentEntity {
  return PaymentEntity.createInstance(
    model.advertSalesId,
    model.dueDate,
    model.status as PaymentStatus,
    model.paymentRequestRef,
    model.installmentNumber,
    model.installmentLabel,
    model.amountBeforeVat,
    model.vatAmount,
    model.withholdTax,
    model.vatWithhold,
    model.totalAmount,
    model.bankDeposit,
    model.balance,
    model.paymentDate,
    model.paymentMethod,
    model.bankDepositDate,
    model.bankConfirmation,
    model.fsNumber,
    model.requestSentDate,
    model.createdAt,
    model.updatedAt,
    model.id,
    'advertSales' in model && model.advertSales ? advertSalesModelToEntity(model.advertSales) : undefined,
  );
}

export function entityToModel(entity: PaymentEntity): Payment {
  return {
    id: entity.id ?? '',
    advertSalesId: entity.advertSalesId,
    paymentRequestRef: entity.paymentRequestRef ?? null,
    installmentNumber: entity.installmentNumber,
    installmentLabel: entity.installmentLabel ?? null,
    amountBeforeVat: entity.amountBeforeVat,
    vatAmount: entity.vatAmount,
    withholdTax: entity.withholdTax,
    vatWithhold: entity.vatWithhold,
    totalAmount: entity.totalAmount,
    bankDeposit: entity.bankDeposit,
    balance: entity.balance,
    dueDate: entity.dueDate,
    paymentDate: entity.paymentDate ?? null,
    paymentMethod: entity.paymentMethod ?? null,
    bankDepositDate: entity.bankDepositDate ?? null,
    bankConfirmation: entity.bankConfirmation ?? null,
    fsNumber: entity.fsNumber ?? null,
    requestSentDate: entity.requestSentDate ?? null,
    status: entity.status,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

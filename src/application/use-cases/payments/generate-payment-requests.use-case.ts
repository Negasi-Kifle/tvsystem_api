import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';

const VAT_RATE = 0.15;
const WITHHOLD_TAX_RATE = 0.02;
const VAT_WITHHOLD_RATE = 0.075;

export type GeneratePaymentRequestsInput = {
  advertSalesId: string;
};

/**
 * Pre-VAT amount for installment `i` (0-based) of `n`, splitting `finalPrice` evenly in cents.
 * The last installment absorbs any remainder so the sum matches `finalPrice`.
 */
function amountBeforeVatForInstallment(finalPrice: number, n: number, i: number): number {
  const totalCents = Math.round(finalPrice * 100);
  const base = Math.floor(totalCents / n);
  if (i === n - 1) {
    return (totalCents - base * (n - 1)) / 100;
  }
  return base / 100;
}

export class GeneratePaymentRequestsUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
  ) {}

  async execute(input: GeneratePaymentRequestsInput): Promise<PaymentEntity[]> {
    const sale = await this.advertSalesRepo.findById(input.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', input.advertSalesId);
    }

    const installmentCount = sale.installmentCount;
    if (!Number.isInteger(installmentCount) || installmentCount < 1) {
      throw new ValidationError('Advert sale has an invalid installment count');
    }

    const existingCount = await this.paymentRepo.count({ advertSalesId: input.advertSalesId });
    if (existingCount > 0) {
      throw new ValidationError('Payment requests already exist for this advert sale');
    }

    const totalDays = Math.max(
      1,
      Math.ceil((sale.adEndDate.getTime() - sale.adStartDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const daysBetweenInstallments = Math.floor(totalDays / installmentCount);

    const payments: PaymentEntity[] = [];

    for (let i = 0; i < installmentCount; i++) {
      const amountBeforeVat = amountBeforeVatForInstallment(sale.finalPrice, installmentCount, i);
      const vatAmount = Math.round(amountBeforeVat * VAT_RATE * 100) / 100;
      const withholdTax = Math.round(amountBeforeVat * WITHHOLD_TAX_RATE * 100) / 100;
      const vatWithhold = Math.round(vatAmount * VAT_WITHHOLD_RATE * 100) / 100;
      const totalAmount = Math.round((amountBeforeVat + vatAmount) * 100) / 100;
      const balance = totalAmount;

      const dueDate = new Date(sale.adStartDate);
      dueDate.setDate(dueDate.getDate() + daysBetweenInstallments * i);

      const ref = await this.generateBusinessRefService.generateBusinessRef();

      const payment = PaymentEntity.createInstance(
        input.advertSalesId,
        dueDate,
        PaymentStatus.Pending,
        `PAY-${ref}`,
        i + 1,
        `Installment ${i + 1} of ${installmentCount}`,
        amountBeforeVat,
        vatAmount,
        withholdTax,
        vatWithhold,
        totalAmount,
        0,
        balance,
      );

      const created = await this.paymentRepo.create(payment);
      payments.push(created);
    }

    return payments;
  }
}

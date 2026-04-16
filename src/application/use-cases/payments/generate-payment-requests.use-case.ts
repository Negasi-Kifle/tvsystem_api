import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';
import { computeDueDateForInstallment, computePaymentAmountsForInstallment } from '../../../domain/services/payment-installment-schedule.service';

export type GeneratePaymentRequestsInput = { advertSalesId: string };

export class GeneratePaymentRequestsUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
  ) { }

  async execute(input: GeneratePaymentRequestsInput): Promise<PaymentEntity[]> {
    const sale = await this.advertSalesRepo.findById(input.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', input.advertSalesId);
    }

    const installmentCount = sale.installmentCount;
    if (!Number.isInteger(installmentCount) || installmentCount < 1) {
      throw new ValidationError('Advert sale has an invalid installment count');
    }

    const existingPaymentRequests = await this.paymentRepo.findMany({ filters: { advertSalesId: input.advertSalesId } });
    if (existingPaymentRequests.length === sale.installmentCount) {
      throw new ValidationError('All installment payments already exist for this advert sale');
    }

    
    const payments: PaymentEntity[] = [];

    for (let i = 0; i < installmentCount; i++) {

      // If index + 1 is equal to one of the existing requests, skip it
      if (existingPaymentRequests.some(request => request.installmentNumber === i + 1)) {
        continue;
      }

      const {
        amountBeforeVat,
        vatAmount,
        withholdTax,
        vatWithhold,
        totalAmount
      } = computePaymentAmountsForInstallment(sale.finalPrice, installmentCount, i);
      const balance = totalAmount;
      const dueDate = computeDueDateForInstallment(
        sale.adStartDate,
        sale.adEndDate,
        installmentCount,
        i,
      );

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

import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';
import {
  computeDueDateForInstallment,
  computePaymentAmountsForInstallment,
} from '../../../domain/services/payment-installment-schedule.service';

export type CreatePaymentRequestInput = {
  advertSalesId: string;
  installmentNumber: number;
};

export class CreatePaymentRequestUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
  ) {}

  async execute(input: CreatePaymentRequestInput): Promise<PaymentEntity> {
    const sale = await this.advertSalesRepo.findById(input.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', input.advertSalesId);
    }

    const installmentCount = sale.installmentCount;
    if (!Number.isInteger(installmentCount) || installmentCount < 1) {
      throw new ValidationError('Advert sale has an invalid installment count');
    }

    const k = input.installmentNumber;
    if (!Number.isInteger(k) || k < 1 || k > installmentCount) {
      throw new ValidationError(
        `Installment number must be between 1 and ${installmentCount} (advert sale installment count)`,
      );
    }

    const existingForInstallment = await this.paymentRepo.count({
      advertSalesId: input.advertSalesId,
      installmentNumber: k,
    });
    if (existingForInstallment > 0) {
      throw new ValidationError(
        'A payment request already exists for this advert sale and installment number',
      );
    }

    const indexZeroBased = k - 1;
    const { amountBeforeVat, vatAmount, withholdTax, vatWithhold, totalAmount } =
      computePaymentAmountsForInstallment(sale.finalPrice, installmentCount, indexZeroBased);
    const balance = totalAmount;

    const dueDate = computeDueDateForInstallment(
      sale.adStartDate,
      sale.adEndDate,
      installmentCount,
      indexZeroBased,
    );

    const ref = await this.generateBusinessRefService.generateBusinessRef();

    const payment = PaymentEntity.createInstance(
      input.advertSalesId,
      dueDate,
      PaymentStatus.Pending,
      `PAY-${ref}`,
      k,
      `Installment ${k} of ${installmentCount}`,
      amountBeforeVat,
      vatAmount,
      withholdTax,
      vatWithhold,
      totalAmount,
      0,
      balance,
    );

    return this.paymentRepo.create(payment);
  }
}

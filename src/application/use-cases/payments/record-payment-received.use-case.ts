import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { EntityNotFoundError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';

export type RecordPaymentInput = {
  bankDeposit: number;
  paymentDate: Date;
  paymentMethod?: string;
  bankDepositDate?: Date;
  bankConfirmation?: string;
  fsNumber?: string;
};

export class RecordPaymentReceivedUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(id: string, input: RecordPaymentInput): Promise<PaymentEntity | null> {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) {
      throw new EntityNotFoundError('Payment not found', 'Payment', id);
    }

    payment.bankDeposit = input.bankDeposit;
    payment.balance = Math.round((payment.totalAmount - input.bankDeposit) * 100) / 100;
    payment.paymentDate = input.paymentDate;
    payment.paymentMethod = input.paymentMethod ?? null;
    payment.bankDepositDate = input.bankDepositDate ?? null;
    payment.bankConfirmation = input.bankConfirmation ?? null;
    payment.fsNumber = input.fsNumber ?? null;
    payment.status = payment.balance <= 0 ? PaymentStatus.Paid : PaymentStatus.Pending;

    return this.paymentRepo.update(payment);
  }
}

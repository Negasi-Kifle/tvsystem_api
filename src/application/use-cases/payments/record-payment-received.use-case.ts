import { PaymentEntity, RecordPaymentInput } from '../../../domain/entities/payment.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';

export type { RecordPaymentInput };

export class RecordPaymentReceivedUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(id: string, input: RecordPaymentInput): Promise<PaymentEntity | null> {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) {
      throw new EntityNotFoundError('Payment not found', 'Payment', id);
    }

    payment.recordPaymentReceived(input);
    return this.paymentRepo.update(payment);
  }
}

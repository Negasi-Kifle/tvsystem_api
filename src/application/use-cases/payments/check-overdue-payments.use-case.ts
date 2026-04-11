import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';

export class CheckOverduePaymentsUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(): Promise<number> {
    const pendingAndSent = await this.paymentRepo.findMany({
      filters: {},
      take: 10000,
    });

    const now = new Date();
    let overdueCount = 0;

    for (const payment of pendingAndSent) {
      if (
        (payment.status === PaymentStatus.Pending || payment.status === PaymentStatus.Sent) &&
        payment.dueDate < now
      ) {
        payment.status = PaymentStatus.Overdue;
        await this.paymentRepo.update(payment);
        overdueCount++;
      }
    }

    return overdueCount;
  }
}

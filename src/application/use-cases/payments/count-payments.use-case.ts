import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';

export class CountPaymentsUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(query: QueryOptions<PaymentEntity>): Promise<number> {
    return this.paymentRepo.count(query.filters);
  }
}

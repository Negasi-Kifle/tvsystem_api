import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';

export class GetPaymentByIdUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(id: string): Promise<PaymentEntity> {
    const row = await this.paymentRepo.findById(id);
    if (!row) {
      throw new EntityNotFoundError('Payment not found', 'Payment', id);
    }
    return row;
  }
}

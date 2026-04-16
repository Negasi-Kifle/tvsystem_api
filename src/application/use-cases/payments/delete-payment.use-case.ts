import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';

export class DeletePaymentUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(id: string): Promise<void> {
    const row = await this.paymentRepo.findById(id);
    if (!row) {
      throw new EntityNotFoundError('Payment not found', 'Payment', id);
    }
    await this.paymentRepo.deleteById(id);
  }
}

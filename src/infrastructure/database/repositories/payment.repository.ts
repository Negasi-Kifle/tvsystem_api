import { BaseRepository } from './base.repository';
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentModel } from '../models/payment.model';
import { TenantContext } from '../../../shared/types/tenant-context.type';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(PaymentModel);
  }

  createPayment(
    payment: Omit<Payment, 'id' | 'status'>,
    ctx: TenantContext
  ): Promise<Payment> {
    return this.create({ ...payment, id: '', status: PaymentStatus.Pending }, ctx);
  }
}

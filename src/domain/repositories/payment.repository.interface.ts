import { PaymentEntity } from '../entities/payment.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IPaymentRepository extends IBaseRepository<PaymentEntity> {}

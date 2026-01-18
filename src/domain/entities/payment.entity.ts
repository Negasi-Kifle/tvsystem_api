import { Money } from '../value-objects/money.value-object';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface Payment {
  id: string;
  advertId: string;
  installmentLabel?: string;
  amount: Money;
  dueDate: Date;
  status: PaymentStatus;
  createdAt?: Date;
}

import { PaymentRepository } from '../../../infrastructure/prisma/repositories/payment.repository';
import { Payment } from '../../../domain/entities/payment.entity';
import { EmailService } from '../../../infrastructure/external/email/email.service';
import { Money } from '../../../domain/value-objects/money.value-object';

interface Payload {
  advertId: string;
  installmentLabel?: string;
  amount: number;
  currency?: string;
  dueDate: string;
  customerEmail?: string;
}

export class GeneratePaymentRequestUseCase {
  constructor(
    private readonly paymentRepo = new PaymentRepository(),
    private readonly emailService = new EmailService()
  ) { }

  async execute(payload: Payload): Promise<Payment> {
    const payment = await this.paymentRepo.createPayment({
      advertId: payload.advertId,
      installmentLabel: payload.installmentLabel,
      amount: new Money(payload.amount, payload.currency || 'ETB'),
      dueDate: new Date(payload.dueDate)
    });

    if (payload.customerEmail) {
      // TODO: send formatted payment request email with invoice details
      await this.emailService.send(
        payload.customerEmail,
        'Payment Request',
        `Payment request for advert ${payload.advertId}`
      );
    }

    return payment;
  }
}

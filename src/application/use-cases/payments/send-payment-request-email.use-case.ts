import { EntityNotFoundError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IEmailService } from '../../../domain/services/email.service';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

export class SendPaymentRequestEmailUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(paymentId: string): Promise<void> {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new EntityNotFoundError('Payment not found', 'Payment', paymentId);
    }

    const sale = await this.advertSalesRepo.findById(payment.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', payment.advertSalesId);
    }

    const customer = await this.customerRepo.findById(sale.customerId);
    const customerEmail = customer?.contacts?.[0]?.email;
    if (!customerEmail) {
      throw new EntityNotFoundError('Customer email not found', 'Customer', sale.customerId);
    }

    const html = `
      <h2>Payment Request - ${payment.paymentRequestRef}</h2>
      <p><strong>Campaign:</strong> ${sale.campaignName}</p>
      <p><strong>Reference:</strong> ${sale.referenceNumber}</p>
      <p><strong>${payment.installmentLabel}</strong></p>
      <table border="1" cellpadding="4" cellspacing="0">
        <tr><td>Amount Before VAT</td><td>${payment.amountBeforeVat.toFixed(2)} ETB</td></tr>
        <tr><td>VAT (15%)</td><td>${payment.vatAmount.toFixed(2)} ETB</td></tr>
        <tr><td>Withhold Tax (2%)</td><td>${payment.withholdTax.toFixed(2)} ETB</td></tr>
        <tr><td>VAT Withhold (7.5%)</td><td>${payment.vatWithhold.toFixed(2)} ETB</td></tr>
        <tr><td><strong>Total Amount</strong></td><td><strong>${payment.totalAmount.toFixed(2)} ETB</strong></td></tr>
      </table>
      <p><strong>Due Date:</strong> ${payment.dueDate.toISOString().split('T')[0]}</p>
    `;

    await this.emailService.send(
      customerEmail,
      `Payment Request - ${payment.paymentRequestRef}`,
      html,
    );

    payment.requestSentDate = new Date();
    payment.status = PaymentStatus.Sent;
    await this.paymentRepo.update(payment);
  }
}

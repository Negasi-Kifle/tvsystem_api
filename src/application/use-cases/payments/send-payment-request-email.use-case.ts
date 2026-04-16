import { EntityNotFoundError } from '../../../domain/errors';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IEmailService } from '../../../domain/services/email.service';

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

    const contactName = customer?.contacts?.[0]?.name ?? customer?.name ?? 'Customer';
    const periodStart = sale.adStartDate.toISOString().split('T')[0];
    const periodEnd = sale.adEndDate.toISOString().split('T')[0];

    const html = `
      <h2>Payment request — ${payment.paymentRequestRef}</h2>
      <p><strong>Bill to:</strong> ${contactName} (${customer?.name ?? ''})</p>
      <p><strong>Campaign:</strong> ${sale.campaignName}</p>
      <p><strong>Sale reference:</strong> ${sale.referenceNumber}</p>
      <p><strong>Campaign period:</strong> ${periodStart} — ${periodEnd}</p>
      <p><strong>Installment:</strong> ${payment.installmentLabel}</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <tr><td>Amount before VAT</td><td>${payment.amountBeforeVat.toFixed(2)} ETB</td></tr>
        <tr><td>VAT (15%)</td><td>${payment.vatAmount.toFixed(2)} ETB</td></tr>
        <tr><td>Withhold tax (2%)</td><td>${payment.withholdTax.toFixed(2)} ETB</td></tr>
        <tr><td>VAT withhold (7.5%)</td><td>${payment.vatWithhold.toFixed(2)} ETB</td></tr>
        <tr><td><strong>Total due</strong></td><td><strong>${payment.totalAmount.toFixed(2)} ETB</strong></td></tr>
      </table>
      <p><strong>Due date:</strong> ${payment.dueDate.toISOString().split('T')[0]}</p>
      <p>Please use reference <strong>${payment.paymentRequestRef}</strong> when making payment.</p>
    `;

    await this.emailService.send(
      customerEmail,
      `Payment Request - ${payment.paymentRequestRef}`,
      html,
    );

    payment.markPaymentRequestSent();
    await this.paymentRepo.update(payment);
  }
}

import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IEmailService } from '../../../domain/services/email.service';
import { GenerateAdvertScheduleUseCase } from './generate-advert-schedule.use-case';

export class SendScheduleEmailUseCase {
  constructor(
    private readonly generateSchedule: GenerateAdvertScheduleUseCase,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(advertSalesId: string): Promise<void> {
    const sale = await this.advertSalesRepo.findById(advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', advertSalesId);
    }

    const customer = await this.customerRepo.findById(sale.customerId);
    const customerEmail = customer?.contacts?.[0]?.email;
    if (!customerEmail) {
      throw new EntityNotFoundError('Customer email not found', 'Customer', sale.customerId);
    }

    const schedule = await this.generateSchedule.execute(advertSalesId);

    const tableRows = schedule.rows
      .map(
        (r) =>
          `<tr>
            <td>${r.date}</td>
            <td>${r.dateEth}</td>
            <td>${r.position}</td>
            <td>${r.durationSeconds}s</td>
            <td>${r.status}</td>
          </tr>`,
      )
      .join('');

    const html = `
      <h2>Ad Schedule - ${schedule.campaignName}</h2>
      <p><strong>Reference:</strong> ${schedule.referenceNumber}</p>
      <p><strong>Package:</strong> ${schedule.packageName}</p>
      <p><strong>Period:</strong> ${schedule.adStartDate.toISOString().split('T')[0]} - ${schedule.adEndDate.toISOString().split('T')[0]}</p>
      <table border="1" cellpadding="4" cellspacing="0">
        <thead>
          <tr><th>Date</th><th>Date (Eth)</th><th>Position</th><th>Duration</th><th>Status</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;

    await this.emailService.send(
      customerEmail,
      `Ad Schedule - ${schedule.referenceNumber}`,
      html,
    );
  }
}

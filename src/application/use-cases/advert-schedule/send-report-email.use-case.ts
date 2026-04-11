import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IEmailService } from '../../../domain/services/email.service';
import { GenerateAdvertReportUseCase } from './generate-advert-report.use-case';

export class SendReportEmailUseCase {
  constructor(
    private readonly generateReport: GenerateAdvertReportUseCase,
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

    const report = await this.generateReport.execute(advertSalesId);

    const tableRows = report.rows
      .map(
        (r) =>
          `<tr>
            <td>${r.date}</td>
            <td>${r.dateEth}</td>
            <td>${r.position}</td>
            <td>${r.durationSeconds}s</td>
            <td>${r.actualAirTime ?? '-'}</td>
            <td>${r.status}</td>
          </tr>`,
      )
      .join('');

    const html = `
      <h2>Ad Report - ${report.campaignName}</h2>
      <p><strong>Reference:</strong> ${report.referenceNumber}</p>
      <p><strong>Package:</strong> ${report.packageName}</p>
      <p><strong>Period:</strong> ${report.adStartDate.toISOString().split('T')[0]} - ${report.adEndDate.toISOString().split('T')[0]}</p>
      <p><strong>Summary:</strong> Aired: ${report.airedCount} | Missed: ${report.missedCount} | Scheduled: ${report.scheduledCount}</p>
      <table border="1" cellpadding="4" cellspacing="0">
        <thead>
          <tr><th>Date</th><th>Date (Eth)</th><th>Position</th><th>Duration</th><th>Actual Air Time</th><th>Status</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;

    await this.emailService.send(
      customerEmail,
      `Ad Report - ${report.referenceNumber}`,
      html,
    );
  }
}

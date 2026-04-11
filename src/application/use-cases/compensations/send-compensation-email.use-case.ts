import { EntityNotFoundError } from '../../../domain/errors';
import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IEmailService } from '../../../domain/services/email.service';

export class SendCompensationEmailUseCase {
  constructor(
    private readonly compensationRepo: ICompensationRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(compensationId: string): Promise<void> {
    const compensation = await this.compensationRepo.findById(compensationId);
    if (!compensation) {
      throw new EntityNotFoundError('Compensation not found', 'Compensation', compensationId);
    }

    const sale = await this.advertSalesRepo.findById(compensation.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', compensation.advertSalesId);
    }

    const customer = await this.customerRepo.findById(sale.customerId);
    const customerEmail = customer?.contacts?.[0]?.email;
    if (!customerEmail) {
      throw new EntityNotFoundError('Customer email not found', 'Customer', sale.customerId);
    }

    const html = `
      <h2>Compensation Proposal - ${sale.referenceNumber}</h2>
      <p><strong>Campaign:</strong> ${sale.campaignName}</p>
      <p><strong>Proposal:</strong> ${compensation.proposal}</p>
      ${compensation.missedDate ? `<p><strong>Missed Date:</strong> ${compensation.missedDate.toISOString().split('T')[0]}</p>` : ''}
      ${compensation.compensationType ? `<p><strong>Type:</strong> ${compensation.compensationType}</p>` : ''}
      <p>Please respond with your acceptance or rejection.</p>
    `;

    await this.emailService.send(
      customerEmail,
      `Compensation Proposal - ${sale.referenceNumber}`,
      html,
    );
  }
}

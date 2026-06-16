import { z } from 'zod';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { EmailAttachment, IEmailService } from '../../../domain/services/email.service';

export type SchedulePdfUpload = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

export type SendScheduleToFinanceEmailInput = {
  advertSalesId: string;
  file: SchedulePdfUpload;
  sentByUserId: string;
};

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(value: Date): string {
  return value.toISOString().split('T')[0] ?? '';
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF';
}

function resolveAttachmentFilename(originalname: string, referenceNumber: string): string {
  const trimmed = originalname.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  return `Advert-Schedule-${referenceNumber}.pdf`;
}

export class SendScheduleToFinanceEmailUseCase {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService,
    private readonly financeEmail: string,
  ) {}

  async execute(input: SendScheduleToFinanceEmailInput): Promise<void> {
    const parsedId = z.uuid('Advert sales ID must be a valid UUID').safeParse(input.advertSalesId);
    if (!parsedId.success) {
      throw new ValidationError(parsedId.error.issues[0]?.message ?? 'Invalid advert sales ID');
    }

    const financeRecipient = this.financeEmail.trim();
    if (!financeRecipient) {
      throw new ValidationError('Finance email is not configured');
    }

    this.validateFile(input.file);

    const sale = await this.advertSalesRepo.findById(parsedId.data);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', parsedId.data);
    }

    const sender = await this.userRepo.findById(input.sentByUserId);
    const sentByLabel = sender
      ? `${sender.fullName} (${sender.email})`
      : input.sentByUserId;

    const customerName = sale.customer?.name ?? 'N/A';
    const advertTypeLabel = sale.festiveSeason
      ? `${sale.advertType} (${sale.festiveSeason})`
      : sale.advertType;
    const periodStart = formatDate(sale.adStartDate);
    const periodEnd = formatDate(sale.adEndDate);
    const sentAt = new Date().toISOString();
    const attachmentFilename = resolveAttachmentFilename(input.file.originalname, sale.referenceNumber);

    const html = `
      <h2>Advert Placement Schedule</h2>
      <p><strong>Reference:</strong> ${esc(sale.referenceNumber)}</p>
      <p><strong>Customer:</strong> ${esc(customerName)}</p>
      <p><strong>Campaign:</strong> ${esc(sale.campaignName)}</p>
      <p><strong>Advert type:</strong> ${esc(advertTypeLabel)}</p>
      <p><strong>Period:</strong> ${esc(periodStart)} to ${esc(periodEnd)}</p>
      <p><strong>Final price:</strong> ${esc(String(sale.finalPrice))}</p>
      <p><strong>Package:</strong> ${esc(sale.adPackage?.name ?? 'N/A')}</p>
      <p><strong>Sent by:</strong> ${esc(sentByLabel)}</p>
      <p><strong>Sent at:</strong> ${esc(sentAt)}</p>
      <p>The detailed advert schedule is attached as a PDF.</p>
    `;

    const attachment: EmailAttachment = {
      filename: attachmentFilename,
      content: input.file.buffer,
      contentType: 'application/pdf',
    };

    await this.emailService.send(
      financeRecipient,
      `Advert Placement Schedule — ${sale.referenceNumber} — ${customerName}`,
      html,
      [attachment],
    );
  }

  private validateFile(file: SchedulePdfUpload | undefined): asserts file is SchedulePdfUpload {
    if (!file) {
      throw new ValidationError('PDF file is required');
    }
    if (file.buffer.length === 0) {
      throw new ValidationError('PDF file must not be empty');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new ValidationError('Only PDF files are allowed');
    }
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      throw new ValidationError('PDF filename must have a .pdf extension');
    }
    if (!isPdfBuffer(file.buffer)) {
      throw new ValidationError('Invalid PDF file');
    }
  }
}

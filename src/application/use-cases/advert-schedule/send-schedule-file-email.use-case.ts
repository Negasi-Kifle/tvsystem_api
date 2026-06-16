import { z } from 'zod';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { EmailAttachment, IEmailService } from '../../../domain/services/email.service';

export type ScheduleFileUpload = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

export type SendScheduleFileEmailInput = {
  advertSalesId: string;
  file: ScheduleFileUpload;
  recipientEmail?: string;
};

const PDF_MIME = 'application/pdf';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(value: Date): string {
  return value.toISOString().split('T')[0] ?? '';
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF';
}

function isXlsxBuffer(buffer: Buffer): boolean {
  return buffer.length >= 2 && buffer.subarray(0, 2).toString('ascii') === 'PK';
}

function resolveAttachmentFilename(originalname: string, referenceNumber: string, extension: 'pdf' | 'xlsx'): string {
  const trimmed = originalname.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  return `Ad-Schedule-${referenceNumber}.${extension}`;
}

export class SendScheduleFileEmailUseCase {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: SendScheduleFileEmailInput): Promise<void> {
    const parsedId = z.uuid('Advert sales ID must be a valid UUID').safeParse(input.advertSalesId);
    if (!parsedId.success) {
      throw new ValidationError(parsedId.error.issues[0]?.message ?? 'Invalid advert sales ID');
    }

    const fileKind = this.validateFile(input.file);

    const sale = await this.advertSalesRepo.findById(parsedId.data);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', parsedId.data);
    }

    const customer = await this.customerRepo.findById(sale.customerId);
    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', sale.customerId);
    }

    const recipientEmail = this.resolveRecipientEmail(input.recipientEmail, customer.contacts?.[0]?.email, sale.customerId);

    const periodStart = formatDate(sale.adStartDate);
    const periodEnd = formatDate(sale.adEndDate);
    const attachmentFilename = resolveAttachmentFilename(
      input.file.originalname,
      sale.referenceNumber,
      fileKind === 'pdf' ? 'pdf' : 'xlsx',
    );
    const attachmentLabel = fileKind === 'pdf' ? 'PDF' : 'Excel spreadsheet';

    const html = `
      <h2>Ad Schedule - ${esc(sale.campaignName)}</h2>
      <p><strong>Reference:</strong> ${esc(sale.referenceNumber)}</p>
      <p><strong>Package:</strong> ${esc(sale.adPackage?.name ?? 'N/A')}</p>
      <p><strong>Period:</strong> ${esc(periodStart)} to ${esc(periodEnd)}</p>
      <p>Your advert schedule is attached as a ${attachmentLabel}.</p>
    `;

    const attachment: EmailAttachment = {
      filename: attachmentFilename,
      content: input.file.buffer,
      contentType: fileKind === 'pdf' ? PDF_MIME : XLSX_MIME,
    };

    await this.emailService.send(
      recipientEmail,
      `Ad Schedule - ${sale.referenceNumber}`,
      html,
      [attachment],
    );
  }

  private resolveRecipientEmail(
    overrideEmail: string | undefined,
    defaultEmail: string | undefined,
    customerId: string,
  ): string {
    if (overrideEmail !== undefined && overrideEmail.trim().length > 0) {
      const parsed = z.string().email('Invalid email address').safeParse(overrideEmail.trim());
      if (!parsed.success) {
        throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid email address');
      }
      return parsed.data;
    }

    if (!defaultEmail) {
      throw new EntityNotFoundError('Customer email not found', 'Customer', customerId);
    }

    return defaultEmail;
  }

  private validateFile(file: ScheduleFileUpload | undefined): 'pdf' | 'xlsx' {
    if (!file) {
      throw new ValidationError('File is required');
    }
    if (file.buffer.length === 0) {
      throw new ValidationError('File must not be empty');
    }
    if (file.mimetype !== PDF_MIME && file.mimetype !== XLSX_MIME) {
      throw new ValidationError('Only PDF and .xlsx files are allowed');
    }

    const lowerName = file.originalname.toLowerCase();
    if (file.mimetype === PDF_MIME && !lowerName.endsWith('.pdf')) {
      throw new ValidationError('PDF filename must have a .pdf extension');
    }
    if (file.mimetype === XLSX_MIME && !lowerName.endsWith('.xlsx')) {
      throw new ValidationError('Excel filename must have a .xlsx extension');
    }

    if (file.mimetype === PDF_MIME) {
      if (!isPdfBuffer(file.buffer)) {
        throw new ValidationError('Invalid PDF file');
      }
      return 'pdf';
    }

    if (!isXlsxBuffer(file.buffer)) {
      throw new ValidationError('Invalid Excel file');
    }
    return 'xlsx';
  }
}

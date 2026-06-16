import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SendScheduleFileEmailUseCase } from '../../application/use-cases/advert-schedule/send-schedule-file-email.use-case';
import { AdvertPackageEntity } from '../../domain/entities/advert-package.entity';
import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { EntityNotFoundError, ValidationError } from '../../domain/errors';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import type { IEmailService } from '../../domain/services/email.service';

const SALE_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const CUSTOMER_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const CUSTOMER_EMAIL = 'contact@acme.com';

function makePdfFile(overrides: Partial<{ originalname: string; mimetype: string; buffer: Buffer }> = {}) {
  return {
    buffer: overrides.buffer ?? Buffer.from('%PDF-1.4 schedule'),
    originalname: overrides.originalname ?? 'schedule.pdf',
    mimetype: overrides.mimetype ?? 'application/pdf',
    size: (overrides.buffer ?? Buffer.from('%PDF-1.4 schedule')).length,
  };
}

function makeXlsxFile(overrides: Partial<{ originalname: string; mimetype: string; buffer: Buffer }> = {}) {
  const buffer = overrides.buffer ?? Buffer.from('PK\x03\x04xlsx-content');
  return {
    buffer,
    originalname: overrides.originalname ?? 'schedule.xlsx',
    mimetype: overrides.mimetype ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: buffer.length,
  };
}

function makeSale() {
  const start = new Date('2026-01-07');
  const end = new Date('2026-01-11');
  const sale = AdvertSalesEntity.createInstance(
    'pkg-id',
    CUSTOMER_ID,
    AdvertSalesStatus.Pending,
    AdvertType.Paid,
    start,
    end,
    60,
    10,
    10000,
    0,
    9000,
    1,
    'New Year Campaign',
    new Date('2025-12-01'),
    'REF-2026-001',
    null,
    0,
    null,
    null,
    null,
    0,
    'Festive',
  );
  sale.id = SALE_ID;
  sale.adPackage = AdvertPackageEntity.createInstance(
    'Prime Package',
    'prime-package',
    ['show-1'],
    1,
    0,
    0,
    0,
    10000,
    0,
    10000,
  );
  return sale;
}

function makeCustomer(withEmail = true) {
  return CustomerEntity.createInstance(
    'CUST-1',
    'Acme Corp',
    withEmail ? [{ name: 'Jane', email: CUSTOMER_EMAIL }] : [],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
    undefined,
    undefined,
    undefined,
    undefined,
    CUSTOMER_ID,
  );
}

describe('SendScheduleFileEmailUseCase', () => {
  const advertSalesRepo = {
    findById: jest.fn<IAdvertSalesRepository['findById']>(),
  };
  const customerRepo = {
    findById: jest.fn<ICustomerRepository['findById']>(),
  };
  const emailService = {
    send: jest.fn<IEmailService['send']>(),
  };

  let useCase: SendScheduleFileEmailUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SendScheduleFileEmailUseCase(
      advertSalesRepo as unknown as IAdvertSalesRepository,
      customerRepo as unknown as ICustomerRepository,
      emailService as unknown as IEmailService,
    );
  });

  it('rejects invalid advert sales id', async () => {
    await expect(
      useCase.execute({
        advertSalesId: 'not-a-uuid',
        file: makePdfFile(),
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects missing file', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: undefined as unknown as ReturnType<typeof makePdfFile>,
      }),
    ).rejects.toThrow('File is required');
  });

  it('rejects empty file', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile({ buffer: Buffer.alloc(0) }),
      }),
    ).rejects.toThrow('File must not be empty');
  });

  it('rejects unsupported mime type', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile({ mimetype: 'text/plain' }),
      }),
    ).rejects.toThrow('Only PDF and .xlsx files are allowed');
  });

  it('rejects invalid pdf magic bytes', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile({ buffer: Buffer.from('NOTPDF') }),
      }),
    ).rejects.toThrow('Invalid PDF file');
  });

  it('rejects invalid xlsx magic bytes', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makeXlsxFile({ buffer: Buffer.from('NOTZIP') }),
      }),
    ).rejects.toThrow('Invalid Excel file');
  });

  it('throws when advert sale is not found', async () => {
    advertSalesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile(),
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('throws when customer is not found', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    customerRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile(),
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('throws when customer email is not found and no override provided', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    customerRepo.findById.mockResolvedValue(makeCustomer(false));

    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile(),
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('rejects invalid override email', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    customerRepo.findById.mockResolvedValue(makeCustomer());

    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile(),
        recipientEmail: 'not-an-email',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('sends email to customer default email with xlsx attachment', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    customerRepo.findById.mockResolvedValue(makeCustomer());
    emailService.send.mockResolvedValue(undefined);

    await useCase.execute({
      advertSalesId: SALE_ID,
      file: makeXlsxFile({ originalname: 'Acme-schedule.xlsx' }),
    });

    expect(emailService.send).toHaveBeenCalledTimes(1);
    expect(emailService.send).toHaveBeenCalledWith(
      CUSTOMER_EMAIL,
      'Ad Schedule - REF-2026-001',
      expect.stringContaining('Ad Schedule - New Year Campaign'),
      [
        expect.objectContaining({
          filename: 'Acme-schedule.xlsx',
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
      ],
    );
  });

  it('sends email to override email with pdf attachment', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    customerRepo.findById.mockResolvedValue(makeCustomer());
    emailService.send.mockResolvedValue(undefined);

    await useCase.execute({
      advertSalesId: SALE_ID,
      file: makePdfFile({ originalname: 'Acme-schedule.pdf' }),
      recipientEmail: 'override@example.com',
    });

    expect(emailService.send).toHaveBeenCalledWith(
      'override@example.com',
      'Ad Schedule - REF-2026-001',
      expect.stringContaining('PDF'),
      [
        expect.objectContaining({
          filename: 'Acme-schedule.pdf',
          contentType: 'application/pdf',
        }),
      ],
    );
  });
});

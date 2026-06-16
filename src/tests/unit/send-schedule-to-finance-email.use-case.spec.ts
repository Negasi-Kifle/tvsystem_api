import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SendScheduleToFinanceEmailUseCase } from '../../application/use-cases/advert-schedule/send-schedule-to-finance-email.use-case';
import { AdvertPackageEntity } from '../../domain/entities/advert-package.entity';
import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { SexTypes } from '../../domain/enums/sex-types.enum';
import { UserRefModel } from '../../domain/enums/user-ref-model.enum';
import { UserRole } from '../../domain/enums/user-role.enum';
import { EntityNotFoundError, ValidationError } from '../../domain/errors';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repo';
import type { IEmailService } from '../../domain/services/email.service';

const SALE_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SENDER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

function makePdfFile(overrides: Partial<{ originalname: string; mimetype: string; buffer: Buffer }> = {}) {
  return {
    buffer: overrides.buffer ?? Buffer.from('%PDF-1.4 schedule'),
    originalname: overrides.originalname ?? 'schedule.pdf',
    mimetype: overrides.mimetype ?? 'application/pdf',
    size: (overrides.buffer ?? Buffer.from('%PDF-1.4 schedule')).length,
  };
}

function makeSale() {
  const start = new Date('2026-01-07');
  const end = new Date('2026-01-11');
  const sale = AdvertSalesEntity.createInstance(
    'pkg-id',
    'cust-id',
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
  sale.customer = CustomerEntity.createInstance('CUST-1', 'Acme Corp');
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

function makeSender() {
  return UserEntity.createInstance(
    'Sales Rep',
    'rep@abbaytv.com',
    'hash',
    '0912345678',
    SexTypes.Male,
    [UserRole.SalesRep],
    true,
    false,
    UserRefModel.Internal,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    SENDER_ID,
  );
}

describe('SendScheduleToFinanceEmailUseCase', () => {
  const advertSalesRepo = {
    findById: jest.fn<IAdvertSalesRepository['findById']>(),
  };
  const userRepo = {
    findById: jest.fn<IUserRepository['findById']>(),
  };
  const emailService = {
    send: jest.fn<IEmailService['send']>(),
  };

  let useCase: SendScheduleToFinanceEmailUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SendScheduleToFinanceEmailUseCase(
      advertSalesRepo as unknown as IAdvertSalesRepository,
      userRepo as unknown as IUserRepository,
      emailService as unknown as IEmailService,
      'finance@abbaytv.com',
    );
  });

  it('rejects invalid advert sales id', async () => {
    await expect(
      useCase.execute({
        advertSalesId: 'not-a-uuid',
        file: makePdfFile(),
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects when finance email is not configured', async () => {
    const unconfiguredUseCase = new SendScheduleToFinanceEmailUseCase(
      advertSalesRepo as unknown as IAdvertSalesRepository,
      userRepo as unknown as IUserRepository,
      emailService as unknown as IEmailService,
      '',
    );

    await expect(
      unconfiguredUseCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile(),
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toThrow('Finance email is not configured');
  });

  it('rejects missing file', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: undefined as unknown as ReturnType<typeof makePdfFile>,
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toThrow('PDF file is required');
  });

  it('rejects empty file', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile({ buffer: Buffer.alloc(0) }),
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toThrow('PDF file must not be empty');
  });

  it('rejects non-pdf mime type', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile({ mimetype: 'text/plain' }),
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toThrow('Only PDF files are allowed');
  });

  it('rejects invalid pdf magic bytes', async () => {
    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile({ buffer: Buffer.from('NOTPDF') }),
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toThrow('Invalid PDF file');
  });

  it('throws when advert sale is not found', async () => {
    advertSalesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        advertSalesId: SALE_ID,
        file: makePdfFile(),
        sentByUserId: SENDER_ID,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('sends email to finance with attachment', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    userRepo.findById.mockResolvedValue(makeSender());
    emailService.send.mockResolvedValue(undefined);

    await useCase.execute({
      advertSalesId: SALE_ID,
      file: makePdfFile({ originalname: 'Acme-schedule.pdf' }),
      sentByUserId: SENDER_ID,
    });

    expect(emailService.send).toHaveBeenCalledTimes(1);
    expect(emailService.send).toHaveBeenCalledWith(
      'finance@abbaytv.com',
      'Advert Placement Schedule — REF-2026-001 — Acme Corp',
      expect.stringContaining('Advert Placement Schedule'),
      [
        expect.objectContaining({
          filename: 'Acme-schedule.pdf',
          contentType: 'application/pdf',
        }),
      ],
    );
  });
});

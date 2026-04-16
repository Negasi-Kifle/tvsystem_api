import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CreatePaymentRequestUseCase } from '../../application/use-cases/payments/create-payment-request.use-case';
import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { EntityNotFoundError, ValidationError } from '../../domain/errors';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import type { IGenerateBusinessRefService } from '../../domain/services/generate-business-ref.service';

function makeSale(overrides: Partial<{ finalPrice: number; installmentCount: number; id: string }> = {}) {
  const start = new Date('2026-01-01');
  const end = new Date('2026-01-10');
  const sale = AdvertSalesEntity.createInstance(
    'pkg-id',
    'cust-id',
    AdvertSalesStatus.Pending,
    AdvertType.Paid,
    start,
    end,
    30,
    1,
    10000,
    0,
    overrides.finalPrice ?? 8000,
    overrides.installmentCount ?? 4,
    'Camp',
    new Date('2025-12-01'),
    'REF-1',
  );
  sale.id = overrides.id ?? 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  return sale;
}

describe('CreatePaymentRequestUseCase', () => {
  const paymentRepo = {
    count: jest.fn<IPaymentRepository['count']>(),
    create: jest.fn<IPaymentRepository['create']>(),
  };
  const advertSalesRepo = {
    findById: jest.fn<IAdvertSalesRepository['findById']>(),
  };
  const generateBusinessRef = jest.fn<IGenerateBusinessRefService['generateBusinessRef']>();

  let useCase: CreatePaymentRequestUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    generateBusinessRef.mockResolvedValue('99');
    paymentRepo.create.mockImplementation(async (data) => {
      const p = PaymentEntity.createInstance(
        data.advertSalesId,
        data.dueDate,
        data.status,
        data.paymentRequestRef,
        data.installmentNumber,
        data.installmentLabel,
        data.amountBeforeVat,
        data.vatAmount,
        data.withholdTax,
        data.vatWithhold,
        data.totalAmount,
        data.bankDeposit,
        data.balance,
      );
      p.id = 'new-pay-id';
      return p;
    });
    useCase = new CreatePaymentRequestUseCase(
      paymentRepo as unknown as IPaymentRepository,
      advertSalesRepo as unknown as IAdvertSalesRepository,
      { generateBusinessRef } as unknown as IGenerateBusinessRefService,
    );
  });

  it('creates one payment for the requested installment with amounts matching bulk split', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale({ finalPrice: 8000, installmentCount: 4 }));
    paymentRepo.count.mockResolvedValue(0);

    const payment = await useCase.execute({
      advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      installmentNumber: 2,
    });

    expect(payment.installmentNumber).toBe(2);
    expect(paymentRepo.count).toHaveBeenCalledWith({
      advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      installmentNumber: 2,
    });
    expect(paymentRepo.create).toHaveBeenCalledTimes(1);
    const createdPayload = paymentRepo.create.mock.calls[0]?.[0];
    expect(createdPayload).toBeDefined();
    expect(createdPayload!.amountBeforeVat).toBe(2000);
    expect(createdPayload!.installmentLabel).toBe('Installment 2 of 4');
  });

  it('throws ValidationError when installment number exceeds advert sale installment count', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale({ installmentCount: 4 }));
    paymentRepo.count.mockResolvedValue(0);

    await expect(
      useCase.execute({
        advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        installmentNumber: 5,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('throws ValidationError when a payment already exists for that installment', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    paymentRepo.count.mockResolvedValue(1);

    await expect(
      useCase.execute({
        advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        installmentNumber: 1,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('throws EntityNotFoundError when advert sale is missing', async () => {
    advertSalesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        advertSalesId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        installmentNumber: 1,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});

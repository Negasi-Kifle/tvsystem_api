import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { GeneratePaymentRequestsUseCase } from '../../application/use-cases/payments/generate-payment-requests.use-case';
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

describe('GeneratePaymentRequestsUseCase', () => {
  const paymentRepo = {
    count: jest.fn<IPaymentRepository['count']>(),
    create: jest.fn<IPaymentRepository['create']>(),
  };
  const advertSalesRepo = {
    findById: jest.fn<IAdvertSalesRepository['findById']>(),
  };
  const generateBusinessRef = jest.fn<IGenerateBusinessRefService['generateBusinessRef']>();

  let useCase: GeneratePaymentRequestsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    generateBusinessRef.mockResolvedValue('1');
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
      p.id = `pay-${data.installmentNumber}`;
      return p;
    });
    useCase = new GeneratePaymentRequestsUseCase(
      paymentRepo as unknown as IPaymentRepository,
      advertSalesRepo as unknown as IAdvertSalesRepository,
      { generateBusinessRef } as unknown as IGenerateBusinessRefService,
    );
  });

  it('splits final price evenly across installments (8000 / 4 => 2000 each before VAT)', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale({ finalPrice: 8000, installmentCount: 4 }));
    paymentRepo.count.mockResolvedValue(0);

    const payments = await useCase.execute({ advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' });

    expect(payments).toHaveLength(4);
    expect(paymentRepo.create).toHaveBeenCalledTimes(4);
    for (const call of paymentRepo.create.mock.calls) {
      expect(call[0].amountBeforeVat).toBe(2000);
    }
  });

  it('puts remainder on last installment when finalPrice does not divide evenly', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale({ finalPrice: 10, installmentCount: 3 }));
    paymentRepo.count.mockResolvedValue(0);

    await useCase.execute({ advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' });

    const amounts = paymentRepo.create.mock.calls.map((c) => c[0].amountBeforeVat);
    expect(amounts[0]).toBe(3.33);
    expect(amounts[1]).toBe(3.33);
    expect(amounts[2]).toBe(3.34);
    expect(amounts.reduce((a, b) => a + b, 0)).toBeCloseTo(10, 5);
  });

  it('throws ValidationError when payments already exist for the advert sale', async () => {
    advertSalesRepo.findById.mockResolvedValue(makeSale());
    paymentRepo.count.mockResolvedValue(1);

    await expect(
      useCase.execute({ advertSalesId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('throws EntityNotFoundError when advert sale is missing', async () => {
    advertSalesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ advertSalesId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});

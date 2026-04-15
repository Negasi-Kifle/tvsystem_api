import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UpdateCustomerUseCase } from '../../application/use-cases/customers/update-customer.use-case';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { MediaMonitoringRecordEntity } from '../../domain/entities/media-monitoring-record.entity';
import { ValidationError } from '../../domain/errors/validation.error';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import type { IMediaMonitoringRecordRepository } from '../../domain/repositories/media-monitoring-record.repository.interface';

describe('UpdateCustomerUseCase (media monitoring)', () => {
  const customerId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const otherCustomerId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const recordId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

  const customerRepo: { findById: jest.MockedFunction<ICustomerRepository['findById']>; update: jest.MockedFunction<ICustomerRepository['update']> } =
    {
      findById: jest.fn(),
      update: jest.fn(),
    };

  const mediaRepo: { findById: jest.MockedFunction<IMediaMonitoringRecordRepository['findById']>; updateStatusByCustomerId: jest.MockedFunction<IMediaMonitoringRecordRepository['updateStatusByCustomerId']> } =
    {
      findById: jest.fn(),
      updateStatusByCustomerId: jest.fn(),
    };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when assigning a monitoring row already linked to another customer', async () => {
    const existing = CustomerEntity.createInstance('BR-1', 'Acme');
    existing.id = customerId;

    const foreignRow = MediaMonitoringRecordEntity.createInstance(
      'EBS',
      'Sponsor',
      new Date(),
      undefined,
      undefined,
      undefined,
      undefined,
      otherCustomerId,
      undefined,
      undefined,
      recordId,
    );

    customerRepo.findById.mockResolvedValue(existing);
    mediaRepo.findById.mockResolvedValue(foreignRow);

    const uc = new UpdateCustomerUseCase(
      customerRepo as unknown as ICustomerRepository,
      mediaRepo as unknown as IMediaMonitoringRecordRepository,
    );

    await expect(
      uc.execute(customerId, { mediaMonitoringId: recordId }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(customerRepo.update).not.toHaveBeenCalled();
  });

  it('allows assigning a monitoring row linked to the same customer', async () => {
    const existing = CustomerEntity.createInstance('BR-1', 'Acme');
    existing.id = customerId;

    const row = MediaMonitoringRecordEntity.createInstance(
      'EBS',
      'Sponsor',
      new Date(),
      undefined,
      undefined,
      undefined,
      undefined,
      customerId,
      undefined,
      undefined,
      recordId,
    );

    const updated = CustomerEntity.createInstance('BR-1', 'Acme');
    updated.id = customerId;
    updated.mediaMonitoringId = recordId;

    customerRepo.findById.mockResolvedValue(existing);
    mediaRepo.findById.mockResolvedValue(row);
    customerRepo.update.mockResolvedValue(updated);

    const uc = new UpdateCustomerUseCase(
      customerRepo as unknown as ICustomerRepository,
      mediaRepo as unknown as IMediaMonitoringRecordRepository,
    );

    const result = await uc.execute(customerId, { mediaMonitoringId: recordId });
    expect(result.mediaMonitoringId).toBe(recordId);
    expect(customerRepo.update).toHaveBeenCalled();
  });
});

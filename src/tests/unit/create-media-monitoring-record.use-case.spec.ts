import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CreateMediaMonitoringRecordUseCase } from '../../application/use-cases/media-monitoring/create-media-monitoring-record.use-case';
import { MediaMonitoringRecordEntity } from '../../domain/entities/media-monitoring-record.entity';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import type { IMediaMonitoringRecordRepository } from '../../domain/repositories/media-monitoring-record.repository.interface';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';

describe('CreateMediaMonitoringRecordUseCase', () => {
  const customerId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

  const mediaRepo: { create: jest.MockedFunction<IMediaMonitoringRecordRepository['create']> } = {
    create: jest.fn(),
  };

  const customerRepo: { findById: jest.MockedFunction<ICustomerRepository['findById']> } = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when customerId is set but customer does not exist', async () => {
    customerRepo.findById.mockResolvedValue(null);

    const uc = new CreateMediaMonitoringRecordUseCase(
      mediaRepo as unknown as IMediaMonitoringRecordRepository,
      customerRepo as unknown as ICustomerRepository,
    );

    await expect(
      uc.execute({
        channel: 'EBS',
        sponsorName: 'X',
        monitoringDate: new Date(),
        customerId,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(mediaRepo.create).not.toHaveBeenCalled();
  });

  it('creates with customerId when customer exists', async () => {
    const customer = CustomerEntity.createInstance('BR-1', 'Acme');
    customer.id = customerId;
    customerRepo.findById.mockResolvedValue(customer);

    const created = MediaMonitoringRecordEntity.createInstance(
      'EBS',
      'X',
      new Date(),
      undefined,
      undefined,
      undefined,
      undefined,
      customerId,
      undefined,
      undefined,
      'rec-id',
    );
    mediaRepo.create.mockResolvedValue(created);

    const uc = new CreateMediaMonitoringRecordUseCase(
      mediaRepo as unknown as IMediaMonitoringRecordRepository,
      customerRepo as unknown as ICustomerRepository,
    );

    const result = await uc.execute({
      channel: 'EBS',
      sponsorName: 'X',
      monitoringDate: new Date(),
      customerId,
    });

    expect(result).toBe(created);
    expect(mediaRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ customerId }),
    );
  });
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CreateCustomerUseCase } from '../../application/use-cases/customers/create-customer.use-case';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import type { IGenerateBusinessRefService } from '../../domain/services/generate-business-ref.service';

describe('CreateCustomerUseCase', () => {
  const customerRepo: {
    create: jest.MockedFunction<ICustomerRepository['create']>;
    createWithBirthMonitoringLink: jest.MockedFunction<
      ICustomerRepository['createWithBirthMonitoringLink']
    >;
  } = {
    create: jest.fn(),
    createWithBirthMonitoringLink: jest.fn(),
  };

  const generateBusinessRef: jest.MockedFunction<IGenerateBusinessRefService['generateBusinessRef']> =
    jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    generateBusinessRef.mockResolvedValue('BR-TEST-1');
  });

  it('uses createWithBirthMonitoringLink when sourced from media monitoring', async () => {
    const birthId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
    const created = CustomerEntity.createInstance(
      'BR-TEST-1',
      'Acme',
      [],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      birthId,
    );
    created.id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

    customerRepo.createWithBirthMonitoringLink.mockResolvedValue(created);

    const uc = new CreateCustomerUseCase(
      customerRepo as unknown as ICustomerRepository,
      { generateBusinessRef } as unknown as IGenerateBusinessRefService,
    );

    const result = await uc.execute({
      name: 'Acme',
      sourceFromMediaMonitoring: true,
      mediaMonitoringId: birthId,
    });

    expect(result).toBe(created);
    expect(customerRepo.createWithBirthMonitoringLink).toHaveBeenCalledWith(
      expect.objectContaining({
        businessRef: 'BR-TEST-1',
        name: 'Acme',
        sourceFromMediaMonitoring: true,
        mediaMonitoringId: birthId,
      }),
      birthId,
    );
    expect(customerRepo.create).not.toHaveBeenCalled();
  });

  it('uses create when not from media monitoring', async () => {
    const created = CustomerEntity.createInstance('BR-TEST-1', 'Solo');
    created.id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    customerRepo.create.mockResolvedValue(created);

    const uc = new CreateCustomerUseCase(
      customerRepo as unknown as ICustomerRepository,
      { generateBusinessRef } as unknown as IGenerateBusinessRefService,
    );

    const result = await uc.execute({ name: 'Solo', sourceFromMediaMonitoring: false });

    expect(result).toBe(created);
    expect(customerRepo.create).toHaveBeenCalled();
    expect(customerRepo.createWithBirthMonitoringLink).not.toHaveBeenCalled();
  });
});

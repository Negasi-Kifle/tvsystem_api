import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CreateShowSegmentSlotUseCase } from '../../application/use-cases/show-segment-slots/create-show-segment-slot.use-case';
import { ShowSegmentSlotEntity } from '../../domain/entities/show-segment-slot.entity';
import { ShowEntity } from '../../domain/entities/show.entity';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../domain/errors';
import { ShowType } from '../../domain/enums/show-type.enum';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import type { IShowSegmentSlotRepository } from '../../domain/repositories/show-segment-slot.repository.interface';
import type { IShowRepository } from '../../domain/repositories/show.repository.interface';

describe('CreateShowSegmentSlotUseCase', () => {
  const showId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const customerId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

  const showRepo: { findById: jest.MockedFunction<IShowRepository['findById']> } = {
    findById: jest.fn(),
  };
  const customerRepo: { findById: jest.MockedFunction<ICustomerRepository['findById']> } = {
    findById: jest.fn(),
  };
  const slotRepo: {
    findByShowAndCustomer: jest.MockedFunction<IShowSegmentSlotRepository['findByShowAndCustomer']>;
    create: jest.MockedFunction<IShowSegmentSlotRepository['create']>;
  } = {
    findByShowAndCustomer: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates when show and customer exist and pair is unique', async () => {
    const show = ShowEntity.createInstance(
      'T',
      't-slug',
      ShowType.InHouse,
      60,
      15,
      1,
      0,
      0,
      undefined,
      undefined,
      new Date(),
      new Date(),
      showId,
    );
    const customer = CustomerEntity.createInstance('BR-1', 'Acme');
    customer.id = customerId;

    showRepo.findById.mockResolvedValue(show);
    customerRepo.findById.mockResolvedValue(customer);
    slotRepo.findByShowAndCustomer.mockResolvedValue(null);

    const created = ShowSegmentSlotEntity.createInstance(showId, customerId, new Date(), new Date(), 'slot-id');
    slotRepo.create.mockResolvedValue(created);

    const uc = new CreateShowSegmentSlotUseCase(
      slotRepo as unknown as IShowSegmentSlotRepository,
      showRepo as unknown as IShowRepository,
      customerRepo as unknown as ICustomerRepository,
    );
    const result = await uc.execute({ showId, customerId });

    expect(result).toBe(created);
    expect(slotRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ showId, customerId }),
    );
  });

  it('throws when show is missing', async () => {
    showRepo.findById.mockResolvedValue(null);
    customerRepo.findById.mockResolvedValue(CustomerEntity.createInstance('BR-1', 'Acme'));
    slotRepo.findByShowAndCustomer.mockResolvedValue(null);

    const uc = new CreateShowSegmentSlotUseCase(
      slotRepo as unknown as IShowSegmentSlotRepository,
      showRepo as unknown as IShowRepository,
      customerRepo as unknown as ICustomerRepository,
    );
    await expect(uc.execute({ showId, customerId })).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(slotRepo.create).not.toHaveBeenCalled();
  });

  it('throws when duplicate show+customer pair exists', async () => {
    const show = ShowEntity.createInstance(
      'T',
      't-slug',
      ShowType.InHouse,
      60,
      15,
      1,
      0,
      0,
      undefined,
      undefined,
      new Date(),
      new Date(),
      showId,
    );
    const customer = CustomerEntity.createInstance('BR-1', 'Acme');
    customer.id = customerId;
    const existing = ShowSegmentSlotEntity.createInstance(showId, customerId, new Date(), new Date(), 'existing');

    showRepo.findById.mockResolvedValue(show);
    customerRepo.findById.mockResolvedValue(customer);
    slotRepo.findByShowAndCustomer.mockResolvedValue(existing);

    const uc = new CreateShowSegmentSlotUseCase(
      slotRepo as unknown as IShowSegmentSlotRepository,
      showRepo as unknown as IShowRepository,
      customerRepo as unknown as ICustomerRepository,
    );
    await expect(uc.execute({ showId, customerId })).rejects.toBeInstanceOf(EntityAlreadyExistsError);
    expect(slotRepo.create).not.toHaveBeenCalled();
  });
});

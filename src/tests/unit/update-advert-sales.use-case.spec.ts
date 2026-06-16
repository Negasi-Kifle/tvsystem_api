import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UpdateAdvertSalesUseCase } from '../../application/use-cases/advert-sales/update-advert-sales.use-case';
import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface';
import type { IAdvertPackageRepository } from '../../domain/repositories/advert-package.repository.interface';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import type { ISubCategoryRepository } from '../../domain/repositories/sub-category.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repo';

const SALE_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

function makeExistingSale(priceInUSD: number | null = null) {
  const sale = AdvertSalesEntity.createInstance(
    'pkg-id',
    'cust-id',
    AdvertSalesStatus.Pending,
    AdvertType.Paid,
    new Date('2026-01-01'),
    new Date('2026-01-10'),
    30,
    1,
    10000,
    0,
    10000,
    1,
    'Campaign',
    new Date('2025-12-01'),
    'REF-1',
    null,
    0,
    null,
    null,
    null,
    0,
    undefined,
    undefined,
    undefined,
    priceInUSD,
  );
  sale.id = SALE_ID;
  return sale;
}

describe('UpdateAdvertSalesUseCase', () => {
  const advertSalesRepo = {
    findById: jest.fn<IAdvertSalesRepository['findById']>(),
    update: jest.fn<IAdvertSalesRepository['update']>(),
  };
  const advertPackageRepo = {} as IAdvertPackageRepository;
  const customerRepo = {} as ICustomerRepository;
  const userRepository = {} as IUserRepository;
  const categoryRepo = {} as ICategoryRepository;
  const subCategoryRepo = {} as ISubCategoryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persists priceInUSD when provided in patch', async () => {
    const existing = makeExistingSale(null);
    advertSalesRepo.findById.mockResolvedValue(existing);
    advertSalesRepo.update.mockImplementation(async (entity) => entity);

    const useCase = new UpdateAdvertSalesUseCase(
      advertSalesRepo as unknown as IAdvertSalesRepository,
      advertPackageRepo,
      customerRepo,
      userRepository,
      categoryRepo,
      subCategoryRepo,
    );

    const result = await useCase.execute(SALE_ID, { priceInUSD: 199.99 });

    expect(result?.priceInUSD).toBe(199.99);
    expect(advertSalesRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({ priceInUSD: 199.99 }),
    );
  });

  it('keeps existing priceInUSD when patch omits it', async () => {
    const existing = makeExistingSale(88.5);
    advertSalesRepo.findById.mockResolvedValue(existing);
    advertSalesRepo.update.mockImplementation(async (entity) => entity);

    const useCase = new UpdateAdvertSalesUseCase(
      advertSalesRepo as unknown as IAdvertSalesRepository,
      advertPackageRepo,
      customerRepo,
      userRepository,
      categoryRepo,
      subCategoryRepo,
    );

    const result = await useCase.execute(SALE_ID, { campaignName: 'Updated Campaign' });

    expect(result?.priceInUSD).toBe(88.5);
    expect(result?.campaignName).toBe('Updated Campaign');
  });
});

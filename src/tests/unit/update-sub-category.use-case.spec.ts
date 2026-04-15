import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UpdateSubCategoryUseCase } from '../../application/use-cases/sub-categories/update-sub-category.use-case';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { SubCategoryEntity } from '../../domain/entities/sub-category.entity';
import { EntityAlreadyExistsError } from '../../domain/errors';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import type { ISubCategoryRepository } from '../../domain/repositories/sub-category.repository.interface';

describe('UpdateSubCategoryUseCase', () => {
  const id = 'bf0f2e5c-9ca3-4927-ad9c-1bdaed80c89c';
  const categoryId = 'ab336704-4da0-4f38-8b50-823f001a46f4';
  const otherId = 'aecdf62f-7242-444b-a52b-3ede4e188bf2';

  const subCategoryRepo: {
    findById: jest.MockedFunction<ISubCategoryRepository['findById']>;
    findByCategoryAndSlug: jest.MockedFunction<ISubCategoryRepository['findByCategoryAndSlug']>;
    update: jest.MockedFunction<ISubCategoryRepository['update']>;
  } = {
    findById: jest.fn(),
    findByCategoryAndSlug: jest.fn(),
    update: jest.fn(),
  };

  const categoryRepo: { findById: jest.MockedFunction<ICategoryRepository['findById']> } = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws EntityAlreadyExistsError when slug is taken by another sub-category in the same category', async () => {
    const existing = SubCategoryEntity.createInstance(categoryId, 'Bank', 'bank', true, undefined, undefined, id);
    const other = SubCategoryEntity.createInstance(categoryId, 'Food', 'food', false, undefined, undefined, otherId);

    subCategoryRepo.findById.mockResolvedValue(existing);
    subCategoryRepo.findByCategoryAndSlug.mockResolvedValue(other);

    const uc = new UpdateSubCategoryUseCase(
      subCategoryRepo as unknown as ISubCategoryRepository,
      categoryRepo as unknown as ICategoryRepository,
    );

    await expect(uc.execute(id, { nameSlug: 'food' })).rejects.toBeInstanceOf(EntityAlreadyExistsError);
    expect(subCategoryRepo.update).not.toHaveBeenCalled();
  });

  it('updates when slug stays unique', async () => {
    const parent = CategoryEntity.createInstance('Food', 'food', undefined, undefined, categoryId, []);
    const existing = SubCategoryEntity.createInstance(
      categoryId,
      'Bank',
      'bank',
      true,
      undefined,
      undefined,
      id,
      parent,
    );
    const updated = SubCategoryEntity.createInstance(
      categoryId,
      'Retail Bank',
      'retail-bank',
      true,
      undefined,
      undefined,
      id,
      parent,
    );

    subCategoryRepo.findById.mockResolvedValue(existing);
    subCategoryRepo.findByCategoryAndSlug.mockResolvedValue(null);
    subCategoryRepo.update.mockResolvedValue(updated);

    const uc = new UpdateSubCategoryUseCase(
      subCategoryRepo as unknown as ISubCategoryRepository,
      categoryRepo as unknown as ICategoryRepository,
    );

    const result = await uc.execute(id, { name: 'Retail Bank' });
    expect(result.name).toBe('Retail Bank');
    expect(subCategoryRepo.update).toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UpdateCategoryUseCase } from '../../application/use-cases/categories/update-category.use-case';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { EntityAlreadyExistsError } from '../../domain/errors';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';

describe('UpdateCategoryUseCase', () => {
  const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const otherId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

  const categoryRepo: {
    findById: jest.MockedFunction<ICategoryRepository['findById']>;
    findByNameSlug: jest.MockedFunction<ICategoryRepository['findByNameSlug']>;
    update: jest.MockedFunction<ICategoryRepository['update']>;
  } = {
    findById: jest.fn(),
    findByNameSlug: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws EntityAlreadyExistsError when slug is owned by another category', async () => {
    const existing = CategoryEntity.createInstance('Finance', 'finance', undefined, undefined, id);
    const other = CategoryEntity.createInstance('Food', 'food', undefined, undefined, otherId);

    categoryRepo.findById.mockResolvedValue(existing);
    categoryRepo.findByNameSlug.mockResolvedValue(other);

    const uc = new UpdateCategoryUseCase(categoryRepo as unknown as ICategoryRepository);

    await expect(uc.execute(id, { nameSlug: 'food' })).rejects.toBeInstanceOf(EntityAlreadyExistsError);
    expect(categoryRepo.update).not.toHaveBeenCalled();
  });

  it('updates when slug is unchanged for same id', async () => {
    const existing = CategoryEntity.createInstance('Finance', 'finance', undefined, undefined, id);
    const updated = CategoryEntity.createInstance(
      'Finance Updated',
      'finance-updated',
      undefined,
      undefined,
      id,
    );

    categoryRepo.findById.mockResolvedValue(existing);
    categoryRepo.findByNameSlug.mockResolvedValue(null);
    categoryRepo.update.mockResolvedValue(updated);

    const uc = new UpdateCategoryUseCase(categoryRepo as unknown as ICategoryRepository);
    const result = await uc.execute(id, { name: 'Finance Updated' });

    expect(result.name).toBe('Finance Updated');
    expect(categoryRepo.update).toHaveBeenCalled();
  });
});

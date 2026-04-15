import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DeleteCategoryUseCase } from '../../application/use-cases/categories/delete-category.use-case';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { SubCategoryEntity } from '../../domain/entities/sub-category.entity';
import { ValidationError } from '../../domain/errors';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';

describe('DeleteCategoryUseCase', () => {
  const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  const categoryRepo: {
    findById: jest.MockedFunction<ICategoryRepository['findById']>;
    deleteById: jest.MockedFunction<ICategoryRepository['deleteById']>;
  } = {
    findById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws ValidationError when sub-categories exist', async () => {
    const sub = SubCategoryEntity.createInstance(id, 'Bank', 'bank', false, undefined, undefined, 'sub-id');
    const existing = CategoryEntity.createInstance('Finance', 'finance', undefined, undefined, id, [sub]);

    categoryRepo.findById.mockResolvedValue(existing);

    const uc = new DeleteCategoryUseCase(categoryRepo as unknown as ICategoryRepository);

    await expect(uc.execute(id)).rejects.toBeInstanceOf(ValidationError);
    expect(categoryRepo.deleteById).not.toHaveBeenCalled();
  });

  it('deletes when there are no sub-categories', async () => {
    const existing = CategoryEntity.createInstance('Finance', 'finance', undefined, undefined, id, []);
    const deleted = CategoryEntity.createInstance('Finance', 'finance', undefined, undefined, id, []);

    categoryRepo.findById.mockResolvedValue(existing);
    categoryRepo.deleteById.mockResolvedValue(deleted);

    const uc = new DeleteCategoryUseCase(categoryRepo as unknown as ICategoryRepository);
    const result = await uc.execute(id);

    expect(result).toBe(deleted);
    expect(categoryRepo.deleteById).toHaveBeenCalledWith(id);
  });
});

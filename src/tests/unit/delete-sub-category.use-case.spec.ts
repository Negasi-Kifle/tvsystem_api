import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DeleteSubCategoryUseCase } from '../../application/use-cases/sub-categories/delete-sub-category.use-case';
import { SubCategoryEntity } from '../../domain/entities/sub-category.entity';
import type { ISubCategoryRepository } from '../../domain/repositories/sub-category.repository.interface';

describe('DeleteSubCategoryUseCase', () => {
  const id = 'bf0f2e5c-9ca3-4927-ad9c-1bdaed80c89c';
  const categoryId = 'ab336704-4da0-4f38-8b50-823f001a46f4';

  const subCategoryRepo: {
    findById: jest.MockedFunction<ISubCategoryRepository['findById']>;
    deleteById: jest.MockedFunction<ISubCategoryRepository['deleteById']>;
  } = {
    findById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes when sub-category exists', async () => {
    const existing = SubCategoryEntity.createInstance(categoryId, 'Bank', 'bank', true, undefined, undefined, id);
    const deleted = SubCategoryEntity.createInstance(categoryId, 'Bank', 'bank', true, undefined, undefined, id);

    subCategoryRepo.findById.mockResolvedValue(existing);
    subCategoryRepo.deleteById.mockResolvedValue(deleted);

    const uc = new DeleteSubCategoryUseCase(subCategoryRepo as unknown as ISubCategoryRepository);
    const result = await uc.execute(id);

    expect(result).toBe(deleted);
    expect(subCategoryRepo.deleteById).toHaveBeenCalledWith(id);
  });
});

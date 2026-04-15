import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';

export class DeleteSubCategoryUseCase {
  constructor(private readonly subCategoryRepo: ISubCategoryRepository) {}

  async execute(id: string): Promise<SubCategoryEntity> {
    const existing = await this.subCategoryRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Sub-category not found', 'SubCategory', id);
    }

    const deleted = await this.subCategoryRepo.deleteById(id);
    if (!deleted) {
      throw new EntityNotFoundError('Sub-category not found', 'SubCategory', id);
    }
    return deleted;
  }
}

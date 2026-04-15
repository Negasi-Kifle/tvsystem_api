import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';

export class GetSubCategoryByIdUseCase {
  constructor(private readonly subCategoryRepo: ISubCategoryRepository) {}

  async execute(id: string): Promise<SubCategoryEntity> {
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) {
      throw new EntityNotFoundError('Sub-category not found', 'SubCategory', id);
    }
    return subCategory;
  }
}

import { SubCategoryEntity } from '../entities/sub-category.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ISubCategoryRepository extends IBaseRepository<SubCategoryEntity> {
  findByCategoryAndSlug(categoryId: string, nameSlug: string): Promise<SubCategoryEntity | null>;
}

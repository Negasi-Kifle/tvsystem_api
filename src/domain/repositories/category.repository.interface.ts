import { CategoryEntity } from '../entities/category.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {
  findByNameSlug(nameSlug: string): Promise<CategoryEntity | null>;
}

import { CategoryEntity } from '../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';

export type CreateCategoryInput = {
  name: string;
  nameSlug?: string;
};

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(payload: CreateCategoryInput): Promise<CategoryEntity> {
    const nameSlug = payload.nameSlug ?? payload.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.categoryRepo.findByNameSlug(nameSlug);
    if (existing) {
      throw new EntityAlreadyExistsError(
        `Category with slug ${nameSlug} already exists`,
        'Category',
        nameSlug,
      );
    }

    const category = CategoryEntity.createInstance(payload.name, nameSlug);
    return this.categoryRepo.create(category);
  }
}

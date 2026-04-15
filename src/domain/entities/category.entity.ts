import type { SubCategoryEntity } from './sub-category.entity';

export class CategoryEntity {
  constructor(
    public name: string,
    public nameSlug: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public subCategories: SubCategoryEntity[] = [],
  ) {}

  public static createInstance(
    name: string,
    nameSlug: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    subCategories: SubCategoryEntity[] = [],
  ): CategoryEntity {
    return new CategoryEntity(name, nameSlug, createdAt, updatedAt, id, subCategories);
  }

  public updateInstance(name?: string, nameSlug?: string): CategoryEntity {
    if (name !== undefined) this.name = name;
    if (nameSlug !== undefined) this.nameSlug = nameSlug;
    this.updatedAt = new Date();
    return this;
  }
}

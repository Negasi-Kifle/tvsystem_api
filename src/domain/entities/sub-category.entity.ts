import type { CategoryEntity } from './category.entity';

export class SubCategoryEntity {
  constructor(
    public categoryId: string,
    public name: string,
    public nameSlug: string,
    public isCustom: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public category?: CategoryEntity,
  ) {}

  public static createInstance(
    categoryId: string,
    name: string,
    nameSlug: string,
    isCustom: boolean = false,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    category?: CategoryEntity,
  ): SubCategoryEntity {
    return new SubCategoryEntity(
      categoryId,
      name,
      nameSlug,
      isCustom,
      createdAt,
      updatedAt,
      id,
      category,
    );
  }

  public updateInstance(
    name?: string,
    nameSlug?: string,
    isCustom?: boolean,
    categoryId?: string,
  ): SubCategoryEntity {
    if (name !== undefined) this.name = name;
    if (nameSlug !== undefined) this.nameSlug = nameSlug;
    if (isCustom !== undefined) this.isCustom = isCustom;
    if (categoryId !== undefined) {
      this.categoryId = categoryId;
      this.category = undefined;
    }
    this.updatedAt = new Date();
    return this;
  }
}

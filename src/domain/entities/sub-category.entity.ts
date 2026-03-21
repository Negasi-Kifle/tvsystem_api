export class SubCategoryEntity {
  constructor(
    public categoryId: string,
    public name: string,
    public nameSlug: string,
    public isCustom: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    categoryId: string,
    name: string,
    nameSlug: string,
    isCustom: boolean = false,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): SubCategoryEntity {
    return new SubCategoryEntity(
      categoryId,
      name,
      nameSlug,
      isCustom,
      createdAt,
      updatedAt,
      id,
    );
  }
}

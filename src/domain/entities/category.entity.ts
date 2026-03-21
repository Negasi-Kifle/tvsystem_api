export class CategoryEntity {
  constructor(
    public name: string,
    public nameSlug: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    name: string,
    nameSlug: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): CategoryEntity {
    return new CategoryEntity(name, nameSlug, createdAt, updatedAt, id);
  }
}

export class ShowSegmentSlotEntity {
  constructor(
    public showId: string,
    public businessRef: string,
    public keyIndustry: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    showId: string,
    businessRef: string,
    keyIndustry: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): ShowSegmentSlotEntity {
    return new ShowSegmentSlotEntity(
      showId,
      businessRef,
      keyIndustry,
      createdAt,
      updatedAt,
      id,
    );
  }
}

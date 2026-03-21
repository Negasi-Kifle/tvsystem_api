export class CustomerShowSuitabilityEntity {
  constructor(
    public customerId: string,
    public showSegmentSlotId: string,
    public createdAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    customerId: string,
    showSegmentSlotId: string,
    createdAt?: Date,
    id?: string,
  ): CustomerShowSuitabilityEntity {
    return new CustomerShowSuitabilityEntity(
      customerId,
      showSegmentSlotId,
      createdAt,
      id,
    );
  }
}

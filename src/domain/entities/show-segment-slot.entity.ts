import { CustomerEntity } from "./customer.entity";
import { ShowEntity } from "./show.entity";

export class ShowSegmentSlotEntity {
  constructor(
    public showId: string,
    public customerId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public show?: ShowEntity,
    public customer?: CustomerEntity,
  ) {}

  public static createInstance(
    showId: string,
    customerId: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    show?: ShowEntity,
    customer?: CustomerEntity
  ): ShowSegmentSlotEntity {
    return new ShowSegmentSlotEntity(showId, customerId, createdAt, updatedAt, id, show, customer);
  }
}

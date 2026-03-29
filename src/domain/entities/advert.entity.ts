import { ValidationError } from '../errors/validation.error';
import { AdvertStatus } from '../enums/advert-status.enum';

export type AdvertSlotWindow = {
  start: Date;
  end: Date;
};

export class AdvertEntity {
  constructor(
    public showId: string,
    public customerId: string,
    public status: AdvertStatus = AdvertStatus.Draft,
    public slot?: AdvertSlotWindow | null,
    public contractDetails?: string | null,
    public broadcastSlotId?: string | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    showId: string,
    customerId: string,
    status: AdvertStatus = AdvertStatus.Draft,
    slot?: AdvertSlotWindow | null,
    contractDetails?: string | null,
    broadcastSlotId?: string | null,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): AdvertEntity {
    if (!showId?.trim()) {
      throw new ValidationError('Show is required');
    }
    if (!customerId?.trim()) {
      throw new ValidationError('Customer is required');
    }
    return new AdvertEntity(
      showId.trim(),
      customerId.trim(),
      status,
      slot ?? null,
      contractDetails ?? null,
      broadcastSlotId ?? null,
      createdAt,
      updatedAt,
      id,
    );
  }
}

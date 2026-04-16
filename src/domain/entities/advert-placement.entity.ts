import { ValidationError } from '../errors/validation.error';
import { AdvertPlacementStatus } from '../enums/advert-placement-status.enum';
import { AdvertPosition } from '../enums/advert-position.enum';

export class AdvertPlacementEntity {
  constructor(
    public advertSalesId: string,
    public showId: string,
    public date: Date,
    public dateEth: string,
    public position: AdvertPosition,
    public durationSeconds: number,
    public status: AdvertPlacementStatus = AdvertPlacementStatus.Scheduled,
    public broadcastSlotId?: string | null,
    public spotIndex: number = 1,
    public broadcastCode?: string | null,
    public plannedTimeMinutes?: number | null,
    public actualAirTime?: Date | null,
    public airAlertSentAt?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    advertSalesId: string,
    showId: string,
    date: Date,
    dateEth: string,
    position: AdvertPosition,
    durationSeconds: number,
    status: AdvertPlacementStatus = AdvertPlacementStatus.Scheduled,
    broadcastSlotId?: string | null,
    spotIndex: number = 1,
    broadcastCode?: string | null,
    plannedTimeMinutes?: number | null,
    actualAirTime?: Date | null,
    airAlertSentAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): AdvertPlacementEntity {
    if (!advertSalesId?.trim()) {
      throw new ValidationError('Advert sales ID is required');
    }
    if (!showId?.trim()) {
      throw new ValidationError('Show ID is required');
    }
    if (durationSeconds <= 0) {
      throw new ValidationError('Duration must be positive');
    }
    if (!Object.values(AdvertPosition).includes(position)) {
      throw new ValidationError(`Position must be one of: ${Object.values(AdvertPosition).join(', ')}`);
    }
    return new AdvertPlacementEntity(
      advertSalesId.trim(),
      showId.trim(),
      date,
      dateEth,
      position,
      durationSeconds,
      status,
      broadcastSlotId ?? null,
      spotIndex,
      broadcastCode ?? null,
      plannedTimeMinutes ?? null,
      actualAirTime ?? null,
      airAlertSentAt ?? null,
      createdAt,
      updatedAt,
      id,
    );
  }
}

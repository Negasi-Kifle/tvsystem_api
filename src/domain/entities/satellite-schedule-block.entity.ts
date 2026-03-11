import { BroadcastType, DayOfWeek } from '../enums/';
import { ValidationError } from '../errors/validation.error';
import { EthiopianTime } from '../value-objects/ethiopian-time.value-objects';
import { ShowSummary } from '../interfaces/show-summary.interface';
import { SatelliteScheduleSummary } from '../interfaces/satellite-schedule-summary.interface';
import { BroadcastSlotSummary } from '../interfaces/broadcast-slot-summary-interface';
export class ScheduleBlockEntity {
  constructor(
    public showId: string,
    public scheduleId: string,
    public dayOfWeek: DayOfWeek,
    public startTimeMinutes: number,
    public durationMinutes: number,
    public broadcastType: BroadcastType,
    public label?: string,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public show?: ShowSummary,
    public schedule?: SatelliteScheduleSummary,
    public broadcastSlots?: BroadcastSlotSummary[],
  ) {}

  static createInstance(
    showId: string,
    scheduleId: string,
    dayOfWeek: DayOfWeek,
    startTimeMinutes: number,
    durationMinutes: number,
    broadcastType: BroadcastType,
    label?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    show?: ShowSummary,
    schedule?: SatelliteScheduleSummary,
    broadcastSlots?: BroadcastSlotSummary[],
  ): ScheduleBlockEntity {
    if (!Object.values(DayOfWeek).includes(dayOfWeek)) {
      throw new ValidationError(`Invalid dayOfWeek: ${dayOfWeek}`);
    }
    if (!Object.values(BroadcastType).includes(broadcastType)) {
      throw new ValidationError(`Invalid broadcastType: ${broadcastType}`);
    }
    if (durationMinutes <= 0) {
      throw new ValidationError('durationMinutes must be greater than 0');
    }
    if (startTimeMinutes < 0 || startTimeMinutes >= 1440) {
      throw new ValidationError('startTimeMinutes must be between 0 and 1439');
    }

    return new ScheduleBlockEntity(
      showId,
      scheduleId,
      dayOfWeek,
      startTimeMinutes,
      durationMinutes,
      broadcastType,
      label,
      id,
      createdAt,
      updatedAt,
      show,
      schedule,
      broadcastSlots,
    );
  }

  updateInstance(
    dayOfWeek?: DayOfWeek,
    startTimeMinutes?: number,
    durationMinutes?: number,
    broadcastType?: BroadcastType,
    showId?: string,
    label?: string | null,
  ): ScheduleBlockEntity {
    if (dayOfWeek !== undefined) this.dayOfWeek = dayOfWeek;
    if (startTimeMinutes !== undefined) this.startTimeMinutes = startTimeMinutes;
    if (durationMinutes !== undefined) this.durationMinutes = durationMinutes;
    if (broadcastType !== undefined) this.broadcastType = broadcastType;
    if (showId !== undefined) this.showId = showId;
    if (label !== undefined) this.label = label ?? undefined;
    this.updatedAt = new Date();
    return this;
  }

  get startTimeGregorian(): string {
    const h = Math.floor(this.startTimeMinutes / 60) % 24;
    const m = this.startTimeMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  get endTimeGregorian(): string {
    const total = this.startTimeMinutes + this.durationMinutes;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  get startTimeEthiopian(): EthiopianTime {
    return EthiopianTime.fromGregorianMinutes(this.startTimeMinutes);
  }

  get endTimeEthiopian(): EthiopianTime {
    return EthiopianTime.fromGregorianMinutes(this.startTimeMinutes + this.durationMinutes);
  }

  get endTimeMinutes(): number {
    return this.startTimeMinutes + this.durationMinutes;
  }

  overlaps(other: ScheduleBlockEntity): boolean {
    return (
      this.dayOfWeek === other.dayOfWeek &&
      this.startTimeMinutes < other.endTimeMinutes &&
      this.endTimeMinutes > other.startTimeMinutes
    );
  }
}
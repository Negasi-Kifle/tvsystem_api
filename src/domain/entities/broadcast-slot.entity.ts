import { BroadcastSlotStatus, BroadcastType, DayOfWeek } from '../enums';
import { ValidationError } from '../errors/validation.error';
import { EthiopianTime } from '../value-objects/ethiopian-time.value-objects';

const VALID_STATUS_TRANSITIONS: Record<BroadcastSlotStatus, BroadcastSlotStatus[]> = {
  [BroadcastSlotStatus.Scheduled]: [BroadcastSlotStatus.Aired, BroadcastSlotStatus.Missed, BroadcastSlotStatus.Preempted, BroadcastSlotStatus.Cancelled],
  [BroadcastSlotStatus.Aired]: [],
  [BroadcastSlotStatus.Missed]: [],
  [BroadcastSlotStatus.Preempted]: [BroadcastSlotStatus.Scheduled],
  [BroadcastSlotStatus.Cancelled]: [],
};

export class BroadcastSlotEntity {
  constructor(
    public scheduleBlockId: string,
    public scheduleId: string,
    public showId: string,
    public date: Date,
    public dateEth: string,
    public dayOfWeek: DayOfWeek,
    public startTimeMinutes: number,
    public durationMinutes: number,
    public broadcastType: BroadcastType,
    public status: BroadcastSlotStatus = BroadcastSlotStatus.Scheduled,
    public label?: string,
    public overrideReason?: string,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  static createInstance(
    scheduleBlockId: string,
    scheduleId: string,
    showId: string,
    date: Date,
    dateEth: string,
    dayOfWeek: DayOfWeek,
    startTimeMinutes: number,
    durationMinutes: number,
    broadcastType: BroadcastType,
    status: BroadcastSlotStatus = BroadcastSlotStatus.Scheduled,
    label?: string,
    overrideReason?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): BroadcastSlotEntity {
    if (!Object.values(DayOfWeek).includes(dayOfWeek)) {
      throw new ValidationError(`Invalid dayOfWeek: ${dayOfWeek}`);
    }
    if (!Object.values(BroadcastType).includes(broadcastType)) {
      throw new ValidationError(`Invalid broadcastType: ${broadcastType}`);
    }
    if (!Object.values(BroadcastSlotStatus).includes(status)) {
      throw new ValidationError(`Invalid status: ${status}`);
    }
    if (durationMinutes <= 0) {
      throw new ValidationError('durationMinutes must be greater than 0');
    }
    if (startTimeMinutes < 0 || startTimeMinutes >= 1440) {
      throw new ValidationError('startTimeMinutes must be between 0 and 1439');
    }

    return new BroadcastSlotEntity(
      scheduleBlockId,
      scheduleId,
      showId,
      date,
      dateEth,
      dayOfWeek,
      startTimeMinutes,
      durationMinutes,
      broadcastType,
      status,
      label,
      overrideReason,
      id,
      createdAt,
      updatedAt,
    );
  }

  updateInstance(
    startTimeMinutes?: number,
    durationMinutes?: number,
    status?: BroadcastSlotStatus,
    label?: string | null,
    overrideReason?: string | null,
  ): BroadcastSlotEntity {
    if (status !== undefined) {
      const allowed = VALID_STATUS_TRANSITIONS[this.status];
      if (!allowed.includes(status)) {
        throw new ValidationError(
          `Cannot transition from ${this.status} to ${status}`,
        );
      }
      this.status = status;
    }
    if (startTimeMinutes !== undefined) {
      if (startTimeMinutes < 0 || startTimeMinutes >= 1440) {
        throw new ValidationError('startTimeMinutes must be between 0 and 1439');
      }
      this.startTimeMinutes = startTimeMinutes;
    }
    if (durationMinutes !== undefined) {
      if (durationMinutes <= 0) {
        throw new ValidationError('durationMinutes must be greater than 0');
      }
      this.durationMinutes = durationMinutes;
    }
    if (label !== undefined) this.label = label ?? undefined;
    if (overrideReason !== undefined) this.overrideReason = overrideReason ?? undefined;
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
}

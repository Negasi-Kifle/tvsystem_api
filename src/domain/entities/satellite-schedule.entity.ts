import { SatelliteScheduleStatus, SatelliteScheduleType } from '../enums';
import { ValidationError } from '../errors/validation.error';

export class SatelliteScheduleEntity {
  constructor(
    public name: string,
    public nameSlug: string,
    public effectiveFrom: Date,
    public effectiveTo: Date,
    public status: SatelliteScheduleStatus = SatelliteScheduleStatus.Draft,
    public scheduleType: SatelliteScheduleType,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  public static createInstance(
    name: string,
    nameSlug: string,
    effectiveFrom: Date,
    effectiveTo: Date,
    scheduleType: SatelliteScheduleType,
    status: SatelliteScheduleStatus = SatelliteScheduleStatus.Draft,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): SatelliteScheduleEntity {
    if (!name || name.trim().length < 2) {
      throw new ValidationError('Name is required and must be at least 2 characters long');
    }
    const slug = nameSlug || name.toLowerCase().replace(/\s+/g, '-');

    if (effectiveFrom >= effectiveTo) {
      throw new ValidationError('effectiveTo must be after effectiveFrom');
    }
      
    return new SatelliteScheduleEntity(
      name,
      slug,
      effectiveFrom,
      effectiveTo,
      status,
      scheduleType,
      id,
      createdAt,
      updatedAt,
    );
  }

  public updateInstance(
    name?: string,
    nameSlug?: string,
    effectiveFrom?: Date,
    effectiveTo?: Date,
    status?: SatelliteScheduleStatus,
    scheduleType?: SatelliteScheduleType,
  ): SatelliteScheduleEntity {
    if (name !== undefined) {
      this.name = name;
      this.nameSlug = nameSlug ?? name.toLowerCase().replace(/\s+/g, '-');
    } else if (nameSlug !== undefined) {
      this.nameSlug = nameSlug;
    }
    if (effectiveFrom !== undefined) this.effectiveFrom = effectiveFrom;
    if (effectiveTo !== undefined) this.effectiveTo = effectiveTo;
    if (status !== undefined) this.status = status;
    if (scheduleType !== undefined) this.scheduleType = scheduleType;
    if (effectiveFrom !== undefined || effectiveTo !== undefined) {
      const from = effectiveFrom ?? this.effectiveFrom;
      const to = effectiveTo ?? this.effectiveTo;
      if (from >= to) {
        throw new ValidationError('effectiveTo must be after effectiveFrom');
      }
    }
    this.updatedAt = new Date();
    return this;
  }
}

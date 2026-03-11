import { DayOfWeek } from '../enums/day-of-week.enum';
import { ShowType } from '../enums/show-type.enum';
import { Status } from '../enums/status';
import { ValidationError } from '../errors/validation.error';

export class ShowEntity {
  constructor(
    public title: string,
    public titleSlug: string,
    public type: ShowType,
    public durationMinutes: number,
    public maxAdLengthMinutes: number,
    public totalDurationMinutes: number,     // durationMinutes + maxAdLengthMinutes (= "Total" column)
    public partsCount: number,           // Number of segments/parts (= "Parts" column)
    public rerunsCount: number,         // = "Re-run" column (0 or 1)
    public bonusCount: number,         // = "Bonus" column (0 or 1)
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public status: Status = Status.Draft
    
  ) { }

  get totalShowDurationMinutes(): number {
    return this.durationMinutes + this.maxAdLengthMinutes;
  }

  
  public static createInstance(
    title: string,
    titleSlug: string,
    type: ShowType,
    durationMinutes: number,
    maxAdLengthMinutes: number,
    partsCount: number,
    rerunsCount: number,
    bonusCount: number,
    status: Status = Status.Draft,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): ShowEntity {

    if (!title) {
      throw new ValidationError('Title is required');
    }

    if (!titleSlug) {
      // Generate title slug
      titleSlug = title.toLowerCase().replace(/ /g, '-');
    }

    if (!type) {
      throw new ValidationError('Type is required');
    }

    if (!durationMinutes || durationMinutes <= 0) {
      throw new ValidationError('Show duration (in minutes) is required and must be greater than 0');
    }

    if (!maxAdLengthMinutes || maxAdLengthMinutes <= 0) {
      throw new ValidationError('Max ad length (in minutes) is required and must be greater than 0');
    }

    if(!partsCount || partsCount <= 0) {
      throw new ValidationError('Parts count is required and must be greater than 0');
    }

    if(!rerunsCount || rerunsCount < 0) {
      throw new ValidationError('Reruns count is required and must be greater than 0');
    }

    if (bonusCount === undefined || bonusCount < 0) {
      throw new ValidationError('Bonus count is required and must be greater than 0');
    }


    const totalDurationMinutes = durationMinutes + maxAdLengthMinutes;

    return new ShowEntity(
      title,
      titleSlug,
      type,
      durationMinutes,
      maxAdLengthMinutes,
      totalDurationMinutes,
      partsCount,
      rerunsCount,
      bonusCount,
      createdAt,
      updatedAt,
      id,
      status);
  }

  public updateInstance(
    title?: string,
    titleSlug?: string,
    type?: ShowType,
    durationMinutes?: number,
    maxAdLengthMinutes?: number,
    partsCount?: number,
    rerunsCount?: number,
    bonusCount?: number,
    status?: Status
  ): ShowEntity {
    if (title !== undefined) {
      this.title = title;
      this.titleSlug = titleSlug ?? title.toLowerCase().replace(/ /g, '-');
    }
    if (type !== undefined) this.type = type;
    if (durationMinutes !== undefined) this.durationMinutes = durationMinutes;
    if (maxAdLengthMinutes !== undefined) this.maxAdLengthMinutes = maxAdLengthMinutes;
    if (partsCount !== undefined) this.partsCount = partsCount;
    if (rerunsCount !== undefined) this.rerunsCount = rerunsCount;
    if (bonusCount !== undefined) this.bonusCount = bonusCount;
    if (status !== undefined) this.status = status;
    if (durationMinutes !== undefined || maxAdLengthMinutes !== undefined) {
      const duration = durationMinutes ?? this.durationMinutes;
      const maxAdLength = maxAdLengthMinutes ?? this.maxAdLengthMinutes;
      this.totalDurationMinutes = duration + maxAdLength;
    }

    this.updatedAt = new Date();
    return this
  }
}
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
    public hostId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public status: Status = Status.Draft
  ) { }

  public static createInstance(
    title: string,
    titleSlug: string,
    type: ShowType,
    durationMinutes: number,
    maxAdLengthMinutes: number,
    hostId: string,
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

    if (!hostId) {
      throw new ValidationError('Host is required');
    }


    createdAt = createdAt ?? new Date();
    updatedAt = updatedAt ?? new Date();
    return new ShowEntity(
      title,
      titleSlug,
      type,
      durationMinutes,
      maxAdLengthMinutes,
      hostId,
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
    hostId?: string,
    status?: Status
  ): ShowEntity {
    if (title !== undefined) {
      this.title = title;
      this.titleSlug = titleSlug ?? title.toLowerCase().replace(/ /g, '-');
    }
    if (type !== undefined) this.type = type;
    if (durationMinutes !== undefined) this.durationMinutes = durationMinutes;
    if (maxAdLengthMinutes !== undefined) this.maxAdLengthMinutes = maxAdLengthMinutes;
    if (hostId !== undefined) this.hostId = hostId;
    if (status !== undefined) this.status = status;

    this.updatedAt = new Date();
    return this
  }
}
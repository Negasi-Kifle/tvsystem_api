import { ShowType } from '../enums/show-type.enum';

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
  ) { }

  public static createInstance(
    title: string,
    titleSlug: string,
    type: ShowType,
    durationMinutes: number,
    maxAdLengthMinutes: number,
    hostId: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): ShowEntity {

    if (!title) {
      throw new Error('Title is required');
    }

    if (!titleSlug) {
      // Generate title slug
      titleSlug = title.toLowerCase().replace(/ /g, '-');
    }

    if (!type) {
      throw new Error('Type is required');
    }

    if (!durationMinutes || durationMinutes <= 0) {
      throw new Error('Duration minutes is required');
    }

    if (!maxAdLengthMinutes || maxAdLengthMinutes <= 0) {
      throw new Error('Max ad length minutes is required');
    }

    if (!hostId) {
      throw new Error('Host is required');
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
      id);
  }

  public updateInstance(
    title?: string,
    titleSlug?: string,
    type?: ShowType,
    durationMinutes?: number,
    maxAdLengthMinutes?: number,
    hostId?: string
  ): ShowEntity {
    if (title !== undefined) {
      this.title = title;
      this.titleSlug = titleSlug ?? title.toLowerCase().replace(/ /g, '-');
    }
    if (type !== undefined) this.type = type;
    if (durationMinutes !== undefined) this.durationMinutes = durationMinutes;
    if (maxAdLengthMinutes !== undefined) this.maxAdLengthMinutes = maxAdLengthMinutes;
    if (hostId !== undefined) this.hostId = hostId;

    this.updatedAt = new Date();
    return this
  }
}
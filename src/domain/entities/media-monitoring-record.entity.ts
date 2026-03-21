export class MediaMonitoringRecordEntity {
  constructor(
    public channel: string,
    public sponsorName: string,
    public monitoringDate: Date,
    public showName?: string,
    public timeSlot?: string,
    public statusWithAbbay?: string,
    public contactInfo?: string,
    public programName?: string,
    public customerId?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    channel: string,
    sponsorName: string,
    monitoringDate: Date,
    showName?: string,
    timeSlot?: string,
    statusWithAbbay?: string,
    contactInfo?: string,
    programName?: string,
    customerId?: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): MediaMonitoringRecordEntity {
    return new MediaMonitoringRecordEntity(
      channel,
      sponsorName,
      monitoringDate,
      showName,
      timeSlot,
      statusWithAbbay,
      contactInfo,
      programName,
      customerId,
      createdAt,
      updatedAt,
      id,
    );
  }

  public updateInstance(
    statusWithAbbay?: string,
    customerId?: string,
  ): MediaMonitoringRecordEntity {
    if (statusWithAbbay !== undefined) this.statusWithAbbay = statusWithAbbay;
    if (customerId !== undefined) this.customerId = customerId;
    this.updatedAt = new Date();
    return this;
  }
}

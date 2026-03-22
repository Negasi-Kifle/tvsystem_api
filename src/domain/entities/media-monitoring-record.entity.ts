import { CustomerStatusWithUs } from '../enums/customer-status.enum';


export class MediaMonitoringRecordEntity {
  constructor(
    public channel: string,
    public sponsorName: string,
    public monitoringDate: Date,
    public showName?: string,
    public timeSlot?: string,
    public statusWithUs: CustomerStatusWithUs = CustomerStatusWithUs.COLD_PROGRESS,
    public contactInfo?: string,
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
    statusWithUs: CustomerStatusWithUs = CustomerStatusWithUs.COLD_PROGRESS,
    contactInfo?: string,
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
      statusWithUs,
      contactInfo,
      customerId,
      createdAt,
      updatedAt,
      id,
    );
  }

  public updateInstance(
    statusWithUs?: CustomerStatusWithUs,
    customerId?: string,
  ): MediaMonitoringRecordEntity {
    if (statusWithUs !== undefined) this.statusWithUs = statusWithUs;
    if (customerId !== undefined) this.customerId = customerId;
    this.updatedAt = new Date();
    return this;
  }
}

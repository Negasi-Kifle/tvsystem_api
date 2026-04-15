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
    channel?: string,
    sponsorName?: string,
    monitoringDate?: Date,
    showName?: string | null,
    timeSlot?: string | null,
    statusWithUs?: CustomerStatusWithUs,
    contactInfo?: string | null,
    customerId?: string | null,
  ): MediaMonitoringRecordEntity {
    if (channel !== undefined) this.channel = channel;
    if (sponsorName !== undefined) this.sponsorName = sponsorName;
    if (monitoringDate !== undefined) this.monitoringDate = monitoringDate;
    if (showName !== undefined) this.showName = showName ?? undefined;
    if (timeSlot !== undefined) this.timeSlot = timeSlot ?? undefined;
    if (statusWithUs !== undefined) this.statusWithUs = statusWithUs;
    if (contactInfo !== undefined) this.contactInfo = contactInfo ?? undefined;
    if (customerId !== undefined) this.customerId = customerId ?? undefined;
    this.updatedAt = new Date();
    return this;
  }
}

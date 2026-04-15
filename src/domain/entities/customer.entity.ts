import { ValidationError } from '../errors/validation.error';
import {CustomerStatusWithUs, CustomerHolidayStatus, CustomerStudioVisit} from '../enums/customer-status.enum';
import { CommunicationLogEntity } from './communication-log.entity';

export type CustomerContact = {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  mobile?: string;
  officeTel?: string;
};

export class CustomerEntity {
  constructor(
    public businessRef: string,
    public name: string,
    public contacts: CustomerContact[] = [],
    public industry?: string,
    public categoryId?: string,
    public subCategoryId?: string,
    public location?: string,
    public salesAgentId?: string,
    public nextReviewDate?: Date,
    public status: CustomerStatusWithUs = CustomerStatusWithUs.COLD_PROGRESS,
    public holidayStatus: CustomerHolidayStatus = CustomerHolidayStatus.UNKNOWN,
    public studioVisit: CustomerStudioVisit = CustomerStudioVisit.NOT_VISITED,
    public otherMediaCampaign?: string,
    public sourceFromMediaMonitoring: boolean = false,
    public mediaMonitoringId?: string,
    public inPersonUpdate?: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public communicationLogs?: CommunicationLogEntity[]
  ) {}

  public static createInstance(
    businessRef: string,
    name: string,
    contacts: CustomerContact[] = [],
    industry?: string,
    categoryId?: string,
    subCategoryId?: string,
    location?: string,
    salesAgentId?: string,
    nextReviewDate?: Date,
    status?: CustomerStatusWithUs,
    holidayStatus?: CustomerHolidayStatus,
    studioVisit?: CustomerStudioVisit,
    otherMediaCampaign?: string,
    sourceFromMediaMonitoring: boolean = false,
    mediaMonitoringId?: string,
    inPersonUpdate?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    communicationLogs?: CommunicationLogEntity[]
  ): CustomerEntity {
    if (!businessRef?.trim()) {
      throw new ValidationError('Business reference is required');
    }
    if (!name?.trim()) {
      throw new ValidationError('Customer name is required');
    }
    return new CustomerEntity(
      businessRef.trim(),
      name.trim(),
      Array.isArray(contacts) ? contacts : [],
      industry,
      categoryId,
      subCategoryId,
      location,
      salesAgentId,
      nextReviewDate,
      status,
      holidayStatus,
      studioVisit,
      otherMediaCampaign,
      sourceFromMediaMonitoring,
      mediaMonitoringId,
      inPersonUpdate,
      createdAt,
      updatedAt,
      id,
      communicationLogs,
    );
  }

  public updateInstance(
    name?: string,
    industry?: string,
    categoryId?: string,
    subCategoryId?: string,
    location?: string,
    salesAgentId?: string,
    nextReviewDate?: Date,
    status?: CustomerStatusWithUs,
    holidayStatus?: CustomerHolidayStatus,
    studioVisit?: CustomerStudioVisit,
    otherMediaCampaign?: string,
    inPersonUpdate?: Date,
    contacts?: CustomerContact[],
    sourceFromMediaMonitoring?: boolean,
    mediaMonitoringId?: string
  ): CustomerEntity {
    if (name !== undefined) this.name = name;
    if (industry !== undefined) this.industry = industry;
    if (categoryId !== undefined) this.categoryId = categoryId;
    if (subCategoryId !== undefined) this.subCategoryId = subCategoryId;
    if (location !== undefined) this.location = location;
    if (salesAgentId !== undefined) this.salesAgentId = salesAgentId;
    if (nextReviewDate !== undefined) this.nextReviewDate = nextReviewDate;
    if (status !== undefined) this.status = status;
    if (holidayStatus !== undefined) this.holidayStatus = holidayStatus;
    if (studioVisit !== undefined) this.studioVisit = studioVisit;
    if (otherMediaCampaign !== undefined) this.otherMediaCampaign = otherMediaCampaign;
    if (inPersonUpdate !== undefined) this.inPersonUpdate = inPersonUpdate;
    if (contacts !== undefined) this.contacts = contacts;
    if (sourceFromMediaMonitoring !== undefined) this.sourceFromMediaMonitoring = sourceFromMediaMonitoring;
    if (mediaMonitoringId !== undefined) this.mediaMonitoringId = mediaMonitoringId;
    this.updatedAt = new Date();
    return this;
  }
}

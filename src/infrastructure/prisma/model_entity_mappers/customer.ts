import { CommunicationLog, Customer } from '../generated/client';
import { CustomerEntity, CustomerContact } from '../../../domain/entities/customer.entity.js';
import { CustomerHolidayStatus, CustomerStatusWithUs, CustomerStudioVisit } from '../../../domain/enums/customer-status.enum.js';
import { modelToEntity as mapCommunicationLogToEntity } from './communication-log';

function parseContacts(contacts: unknown): CustomerContact[] {
  if (!contacts || !Array.isArray(contacts)) return [];
  return contacts.map((c: unknown) => {
    const o = c as Record<string, unknown>;
    return {
      name: typeof o.name === 'string' ? o.name : undefined,
      email: typeof o.email === 'string' ? o.email : undefined,
      phone: typeof o.phone === 'string' ? o.phone : undefined,
      position: typeof o.position === 'string' ? o.position : undefined,
      mobile: typeof o.mobile === 'string' ? o.mobile : undefined,
      officeTel: typeof o.officeTel === 'string' ? o.officeTel : undefined,
    };
  });
}

export type CustomerWithRelations = Customer & {
  communicationLogs?: CommunicationLog[] | null;
};

export function modelToEntity(model: CustomerWithRelations): CustomerEntity {
  return CustomerEntity.createInstance(
    model.businessRef,
    model.name,
    parseContacts(model.contacts),
    model.industry ?? undefined,
    model.categoryId ?? undefined,
    model.subCategoryId ?? undefined,
    model.location ?? undefined,
    model.salesAgentId ?? undefined,
    model.nextReviewDate ? new Date(model.nextReviewDate) : undefined,
    model.status as CustomerStatusWithUs | undefined,
    model.holidayStatus as CustomerHolidayStatus | undefined,
    model.studioVisit as CustomerStudioVisit | undefined,
    model.otherMediaCampaign ?? undefined,
    model.sourceFromMediaMonitoring,
    model.mediaMonitoringId ?? undefined,
    model.inPersonUpdate ? new Date(model.inPersonUpdate) : undefined,
    model.createdAt,
    model.updatedAt,
    model.id,
    model.communicationLogs ? model.communicationLogs.map(mapCommunicationLogToEntity) : undefined,
  );
}

export function entityToModel(entity: CustomerEntity) {
  return {
    id: entity.id ?? '',
    businessRef: entity.businessRef,
    name: entity.name,
    industry: entity.industry ?? null,
    contacts: entity.contacts as object,
    categoryId: entity.categoryId ?? null,
    subCategoryId: entity.subCategoryId ?? null,
    location: entity.location ?? null,
    salesAgentId: entity.salesAgentId ?? null,
    nextReviewDate: entity.nextReviewDate ?? null,
    status: entity.status ?? null,
    holidayStatus: entity.holidayStatus ?? null,
    studioVisit: entity.studioVisit ?? null,
    otherMediaCampaign: entity.otherMediaCampaign ?? null,
    sourceFromMediaMonitoring: entity.sourceFromMediaMonitoring,
    mediaMonitoringId: entity.mediaMonitoringId ?? null,
    inPersonUpdate: entity.inPersonUpdate ?? null,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

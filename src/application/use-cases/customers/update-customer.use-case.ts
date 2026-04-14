import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { CustomerStatusWithUs, CustomerHolidayStatus, CustomerStudioVisit } from '../../../domain/enums/customer-status.enum';

export type UpdateCustomerInput = Partial<{
  name: string;
  industry: string;
  categoryId: string;
  subCategoryId: string;
  location: string;
  salesAgentId: string;
  nextReviewDate: Date;
  status: CustomerStatusWithUs;
  holidayStatus: CustomerHolidayStatus;
  studioVisit: CustomerStudioVisit;
  otherMediaCampaign: string;
  inPersonUpdate: Date;
  contacts: { name?: string; email?: string; phone?: string; position?: string; mobile?: string; officeTel?: string }[];
  sourceFromMediaMonitoring: boolean;
}>;

export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository,
  ) {}

  async execute(customerId: string, payload: UpdateCustomerInput): Promise<CustomerEntity> {
    const existing = await this.customerRepo.findById(customerId);
    if (!existing) {
      throw new EntityNotFoundError('Customer not found', 'Customer', customerId);
    }

    const statusChanged = payload.status !== undefined && payload.status !== existing.status;
    const holidayStatusChanged =
      payload.holidayStatus !== undefined && payload.holidayStatus !== existing.holidayStatus;

    existing.updateInstance(
      payload.name,
      payload.industry,
      payload.categoryId,
      payload.subCategoryId,
      payload.location,
      payload.salesAgentId,
      payload.nextReviewDate,
      payload.status,
      payload.holidayStatus,
      payload.studioVisit,
      payload.otherMediaCampaign,
      payload.inPersonUpdate,
      payload.contacts,
      payload.sourceFromMediaMonitoring,
    );

    const updated = await this.customerRepo.update(existing);
    if (!updated) throw new EntityNotFoundError('Customer not found', 'Customer', customerId);

    if ((statusChanged || holidayStatusChanged) && updated.id) {
      const statusToSync = updated.status ?? updated.holidayStatus ?? '';
      if (statusToSync) {
        await this.mediaMonitoringRepo.updateStatusByCustomerId(updated.id, statusToSync);
      }
    }

    return updated;
  }
}

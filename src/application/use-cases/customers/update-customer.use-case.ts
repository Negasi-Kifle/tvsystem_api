import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { CustomerStatusWithUs, CustomerHolidayStatus, CustomerStudioVisit } from '../../../domain/enums/customer-status.enum';
import { ValidationError } from '../../../domain/errors/validation.error';

export type UpdateCustomerInput = Partial<{
  name: string;
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
  sourceFromMediaMonitoring?: boolean;
  mediaMonitoringId?: string
}>;

export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository,
  ) { }

  async execute(customerId: string, payload: UpdateCustomerInput): Promise<CustomerEntity> {
    const existing = await this.customerRepo.findById(customerId);
    if (!existing) {
      throw new EntityNotFoundError('Customer not found', 'Customer', customerId);
    }

    const statusChanged = payload.status !== undefined && payload.status !== existing.status;
    const holidayStatusChanged =
      payload.holidayStatus !== undefined && payload.holidayStatus !== existing.holidayStatus;

    const nextMediaMonitoringId: string | null | undefined =
      payload.sourceFromMediaMonitoring === false
        ? null
        : payload.mediaMonitoringId !== undefined
          ? payload.mediaMonitoringId
          : undefined;

    if (payload.sourceFromMediaMonitoring === true) {
      const effectiveBirthId =
        typeof nextMediaMonitoringId === 'string'
          ? nextMediaMonitoringId
          : existing.mediaMonitoringId;
      if (!effectiveBirthId) {
        throw new ValidationError('Media monitoring ID is required if customer is from media monitoring');
      }
    }

    if (typeof nextMediaMonitoringId === 'string') {
      const record = await this.mediaMonitoringRepo.findById(nextMediaMonitoringId);
      if (!record) {
        throw new EntityNotFoundError(
          'Media monitoring record not found',
          'MediaMonitoringRecord',
          nextMediaMonitoringId,
        );
      }
      if (record.customerId !== null && record.customerId !== customerId) {
        throw new ValidationError(
          'This media monitoring record is already linked to another customer',
        );
      }
    }

    const sourceToApply: boolean | undefined =
      nextMediaMonitoringId === null
        ? false
        : payload.sourceFromMediaMonitoring !== undefined
          ? payload.sourceFromMediaMonitoring
          : undefined;

    existing.updateInstance(
      payload.name,
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
      sourceToApply,
      nextMediaMonitoringId,
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

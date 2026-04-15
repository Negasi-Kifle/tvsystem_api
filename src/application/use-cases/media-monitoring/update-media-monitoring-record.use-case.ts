import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { CustomerStatusWithUs } from '../../../domain/enums/customer-status.enum';

export type UpdateMediaMonitoringRecordInput = Partial<{
  channel: string;
  sponsorName: string;
  monitoringDate: Date;
  showName: string | null;
  timeSlot: string | null;
  statusWithUs: CustomerStatusWithUs;
  contactInfo: string | null;
  customerId: string | null;
}>;

export class UpdateMediaMonitoringRecordUseCase {
  constructor(
    private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string, payload: UpdateMediaMonitoringRecordInput): Promise<MediaMonitoringRecordEntity> {
    const existing = await this.mediaMonitoringRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Media monitoring record not found', 'MediaMonitoringRecord', id);
    }

    if (payload.customerId !== undefined && payload.customerId !== null) {
      const customer = await this.customerRepo.findById(payload.customerId);
      if (!customer) {
        throw new EntityNotFoundError('Customer not found', 'Customer', payload.customerId);
      }
    }

    existing.updateInstance(
      payload.channel,
      payload.sponsorName,
      payload.monitoringDate,
      payload.showName,
      payload.timeSlot,
      payload.statusWithUs,
      payload.contactInfo,
      payload.customerId,
    );

    const updated = await this.mediaMonitoringRepo.update(existing);
    if (!updated) {
      throw new EntityNotFoundError('Media monitoring record not found', 'MediaMonitoringRecord', id);
    }
    return updated;
  }
}

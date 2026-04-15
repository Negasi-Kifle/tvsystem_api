import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import { IMediaMonitoringRecordRepository } from '../../../domain/repositories/media-monitoring-record.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { CustomerStatusWithUs } from '../../../domain/enums/customer-status.enum';

export type CreateMediaMonitoringRecordInput = {
  channel: string;
  sponsorName: string;
  monitoringDate: Date;
  showName?: string;
  timeSlot?: string;
  statusWithUs?: CustomerStatusWithUs;
  contactInfo?: string;
  customerId?: string;
};

export class CreateMediaMonitoringRecordUseCase {
  constructor(
    private readonly mediaMonitoringRepo: IMediaMonitoringRecordRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(payload: CreateMediaMonitoringRecordInput): Promise<MediaMonitoringRecordEntity> {
    if (payload.customerId) {
      const customer = await this.customerRepo.findById(payload.customerId);
      if (!customer) {
        throw new EntityNotFoundError('Customer not found', 'Customer', payload.customerId);
      }
    }

    const record = MediaMonitoringRecordEntity.createInstance(
      payload.channel,
      payload.sponsorName,
      payload.monitoringDate,
      payload.showName,
      payload.timeSlot,
      payload.statusWithUs,
      payload.contactInfo,
      payload.customerId,
    );

    return this.mediaMonitoringRepo.create(record);
  }
}

import { MediaMonitoringRecord } from '../generated/client';
import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';
import { CustomerStatusWithUs } from '../../../domain/enums/customer-status.enum';

export function modelToEntity(model: MediaMonitoringRecord): MediaMonitoringRecordEntity {
  return MediaMonitoringRecordEntity.createInstance(
    model.channel,
    model.sponsorName,
    model.monitoringDate,
    model.showName ?? undefined,
    model.timeSlot ?? undefined,
    model.statusWithUs as CustomerStatusWithUs ?? undefined,
    model.contactInfo ?? undefined,
    model.customerId ?? undefined,
    model.createdAt,
    model.updatedAt,
    model.id,
  );
}

export function entityToModel(entity: MediaMonitoringRecordEntity) {
  return {
    id: entity.id ?? '',
    channel: entity.channel,
    sponsorName: entity.sponsorName,
    showName: entity.showName ?? null,
    timeSlot: entity.timeSlot ?? null,
    monitoringDate: entity.monitoringDate,
    statusWithUs: entity.statusWithUs ?? null,
    contactInfo: entity.contactInfo ?? null,
    customerId: entity.customerId ?? null,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

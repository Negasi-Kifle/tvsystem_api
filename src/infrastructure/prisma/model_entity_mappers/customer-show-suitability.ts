import { CustomerShowSuitability } from '../generated/client';
import { CustomerShowSuitabilityEntity } from '../../../domain/entities/customer-show-suitability.entity.js';

export function modelToEntity(model: CustomerShowSuitability): CustomerShowSuitabilityEntity {
  return CustomerShowSuitabilityEntity.createInstance(
    model.customerId,
    model.showSegmentSlotId,
    model.createdAt,
    model.id,
  );
}

export function entityToModel(entity: CustomerShowSuitabilityEntity) {
  return {
    id: entity.id ?? '',
    customerId: entity.customerId,
    showSegmentSlotId: entity.showSegmentSlotId,
    createdAt: entity.createdAt ?? new Date(),
  };
}

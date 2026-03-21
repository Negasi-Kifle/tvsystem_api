import { ShowSegmentSlot } from '../generated/client';
import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity.js';

export function modelToEntity(model: ShowSegmentSlot): ShowSegmentSlotEntity {
  return ShowSegmentSlotEntity.createInstance(
    model.showId,
    model.businessRef,
    model.keyIndustry,
    model.createdAt,
    model.updatedAt,
    model.id,
  );
}

export function entityToModel(entity: ShowSegmentSlotEntity) {
  return {
    id: entity.id ?? '',
    showId: entity.showId,
    businessRef: entity.businessRef,
    keyIndustry: entity.keyIndustry,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

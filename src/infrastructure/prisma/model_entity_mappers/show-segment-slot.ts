import { Prisma, ShowSegmentSlot } from '../generated/client';
import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity.js';
import { modelToEntity as mapShowToEntity } from './show';
import { modelToEntity as mapCustomerToEntity } from './customer';

// Populate show and customer
type ShowSegmentSlotWithRelations = Prisma.ShowSegmentSlotGetPayload<{
  include: { show: true; customer: true };
}>;

type ShowSegmentSlotLike = Prisma.ShowSegmentSlotGetPayload<{}> | ShowSegmentSlotWithRelations;

export function modelToEntity(model: ShowSegmentSlotLike): ShowSegmentSlotEntity {
  return ShowSegmentSlotEntity.createInstance(
    model.showId,
    model.customerId,
    model.createdAt,
    model.updatedAt,
    model.id,
    'show' in model && model.show ? mapShowToEntity(model.show) : undefined,
    'customer' in model && model.customer ? mapCustomerToEntity(model.customer) : undefined,
  );
}

export function entityToModel(entity: ShowSegmentSlotEntity): ShowSegmentSlot {
  return {
    id: entity.id ?? '',
    showId: entity.showId,
    customerId: entity.customerId,
    createdAt: entity.createdAt ?? new Date(),
    updatedAt: entity.updatedAt ?? new Date(),
  };
}

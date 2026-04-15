import { Prisma } from '../generated/client';
import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';

export function buildWhereClauseForShowSegmentSlot(
  filters: Partial<ShowSegmentSlotEntity>,
): Prisma.ShowSegmentSlotWhereInput {
  if (!filters) return {};
  return {
    ...(filters.showId !== undefined && { showId: filters.showId }),
    ...(filters.customerId !== undefined && { customerId: filters.customerId }),
  };
}

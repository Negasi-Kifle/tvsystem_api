import { Prisma } from '../generated/client';
import { AdvertEntity } from '../../../domain/entities/advert.entity';
import { AdvertStatus } from '../../../domain/enums/advert-status.enum';

export function buildWhereClauseForAdvert(filters: Partial<AdvertEntity>): Prisma.AdvertWhereInput {
  if (!filters) return {};
  return {
    ...(filters.showId !== undefined && { showId: filters.showId }),
    ...(filters.customerId !== undefined && { customerId: filters.customerId }),
    ...(filters.broadcastSlotId !== undefined && { broadcastSlotId: filters.broadcastSlotId }),
    ...(filters.status !== undefined && { status: filters.status as AdvertStatus }),
  };
}

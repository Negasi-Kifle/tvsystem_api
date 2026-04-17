import { Prisma } from '../generated/client';
import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';

export function buildWhereClauseForAdvertPlacement(
  filters: Partial<AdvertPlacementEntity> & { dateFrom?: Date; dateTo?: Date },
): Prisma.AdvertPlacementWhereInput {
  if (!filters) return {};

  const where: Prisma.AdvertPlacementWhereInput = {};

  if (filters.id !== undefined) {
    where.id = Array.isArray(filters.id) ? { in: filters.id } : filters.id;
  }
  if (filters.advertSalesId) where.advertSalesId = filters.advertSalesId;
  if (filters.showId) where.showId = filters.showId;
  if (filters.broadcastSlotId) where.broadcastSlotId = filters.broadcastSlotId;
  if (filters.status) where.status = filters.status;
  if (filters.position) where.position = filters.position;
  if (filters.broadcastCode) where.broadcastCode = filters.broadcastCode;
  if (filters.dateFrom || filters.dateTo) {
    where.date = {};
    if (filters.dateFrom) (where.date as Record<string, Date>).gte = filters.dateFrom;
    if (filters.dateTo) (where.date as Record<string, Date>).lte = filters.dateTo;
  }

  return where;
}

import { Prisma } from '@prisma/client';
import { BroadcastSlotFilters } from '../../../domain/interfaces/broadcast-slot-filters.interface';

export function buildWhereClauseForBroadcastSlot(
  filters: BroadcastSlotFilters,
): Prisma.BroadcastSlotWhereInput {
  if (!filters) return {};

  const where: Prisma.BroadcastSlotWhereInput = {};

  if (filters.scheduleId) where.scheduleId = filters.scheduleId;
  if (filters.scheduleBlockId) where.scheduleBlockId = filters.scheduleBlockId;
  if (filters.showId) where.showId = filters.showId;
  if (filters.dayOfWeek) where.dayOfWeek = filters.dayOfWeek;
  if (filters.status) where.status = filters.status;
  if (filters.broadcastType) where.broadcastType = filters.broadcastType;

  if (filters.dateFrom || filters.dateTo) {
    where.date = {};
    if (filters.dateFrom) where.date.gte = filters.dateFrom;
    if (filters.dateTo) where.date.lte = filters.dateTo;
  }

  return where;
}

import { Prisma } from '../generated/client';
import { ShowHostFilters } from '../../../domain/interfaces/show-host-filters.interface';
import { RevenueShareType } from '../../../domain/enums';

export function buildWhereClauseForShowHost(filters: ShowHostFilters): Prisma.ShowHostWhereInput {
  if (!filters) return {};

  return {
    ...(filters.showId && { showId: filters.showId }),
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.revenueShareType && { revenueShareType: filters.revenueShareType as RevenueShareType }),
    ...(filters.isPrimary != null && { isPrimary: filters.isPrimary }),
  };
}


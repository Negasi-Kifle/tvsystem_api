import { Prisma } from '../generated/client';
import type { MediaMonitoringRecordFilters } from '../../../domain/types/media-monitoring-record-filters';

export function buildWhereClauseForMediaMonitoringRecord(
  filters: MediaMonitoringRecordFilters | undefined,
): Prisma.MediaMonitoringRecordWhereInput {
  if (!filters) return {};
  return {
    ...(filters.channel !== undefined && { channel: filters.channel }),
    ...(filters.sponsorName !== undefined && {
      sponsorName: { contains: filters.sponsorName, mode: 'insensitive' },
    }),
    ...(filters.unlinkedOnly === true
      ? { customerId: null }
      : filters.customerId !== undefined
        ? { customerId: filters.customerId }
        : {}),
  };
}

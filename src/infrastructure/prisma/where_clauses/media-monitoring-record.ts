import { Prisma } from '../generated/client';
import { MediaMonitoringRecordEntity } from '../../../domain/entities/media-monitoring-record.entity';

export function buildWhereClauseForMediaMonitoringRecord(
  filters: Partial<MediaMonitoringRecordEntity>
): Prisma.MediaMonitoringRecordWhereInput {
  if (!filters) return {};
  return {
    ...(filters.channel !== undefined && { channel: filters.channel }),
    ...(filters.sponsorName !== undefined && {
      sponsorName: { contains: filters.sponsorName, mode: 'insensitive' },
    }),
    ...(filters.customerId !== undefined && { customerId: filters.customerId }),
  };
}

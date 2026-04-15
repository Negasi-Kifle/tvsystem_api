import type { MediaMonitoringRecordEntity } from '../../domain/entities/media-monitoring-record.entity';
import type { MediaMonitoringRecordFilters } from '../../domain/types/media-monitoring-record-filters';
import type { QueryOptions } from '../../domain/interfaces/query-options.interface';
import type { FetchAllMediaMonitoringRecordsDto } from '../dtos/requests/media-monitoring/fetch-all-media-monitoring-records.dto';

export function mapFetchAllMediaMonitoringRecordsDtoToQueryOptions(
  dto: FetchAllMediaMonitoringRecordsDto,
): QueryOptions<MediaMonitoringRecordEntity, MediaMonitoringRecordFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  const filters: MediaMonitoringRecordFilters = {
    ...(dto.channel != null && { channel: dto.channel }),
    ...(dto.sponsorName != null && dto.sponsorName !== '' && { sponsorName: dto.sponsorName }),
    ...(dto.customerId != null && { customerId: dto.customerId }),
    ...(dto.unlinkedOnly === true && { unlinkedOnly: true }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
  };
}

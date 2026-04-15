import type { MediaMonitoringRecordEntity } from '../entities/media-monitoring-record.entity';

/** Filters for listing/counting media monitoring records (includes list-only flags). */
export type MediaMonitoringRecordFilters = Partial<MediaMonitoringRecordEntity> & {
  unlinkedOnly?: boolean;
};

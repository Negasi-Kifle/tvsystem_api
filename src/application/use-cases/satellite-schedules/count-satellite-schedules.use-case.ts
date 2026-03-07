import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleFilters } from '../../../domain/interfaces/satellite-schedule-filters.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class CountSatelliteSchedulesUseCase {
  constructor(private readonly scheduleRepo: ISatelliteScheduleRepository) {}

  async execute(
    query: QueryOptions<SatelliteScheduleEntity, SatelliteScheduleFilters>,
  ): Promise<number> {
    return this.scheduleRepo.count(query.filters ?? {});
  }
}

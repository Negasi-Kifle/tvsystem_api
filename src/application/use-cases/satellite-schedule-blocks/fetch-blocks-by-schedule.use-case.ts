import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { ScheduleBlockFilters } from '../../../domain/interfaces/schedule-block-filters.interface';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchBlocksByScheduleUseCase {
  constructor(private readonly blockRepo: IScheduleBlockRepository) {}

  async execute(
    query: QueryOptions<ScheduleBlockEntity, ScheduleBlockFilters>,
  ): Promise<ScheduleBlockEntity[]> {
    return this.blockRepo.findMany(query);
  }
}

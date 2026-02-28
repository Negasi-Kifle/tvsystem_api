import { ShowEntity } from '../../../domain/entities/show.entity';
import { ShowFilters } from '../../../domain/interfaces/show-filters.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class FetchAllShowsUseCase {
  constructor(private readonly showRepo: IShowRepository) { }

  async execute(query: QueryOptions<ShowEntity, ShowFilters>): Promise<ShowEntity[]> {
    return this.showRepo.findMany(query);
  }
}

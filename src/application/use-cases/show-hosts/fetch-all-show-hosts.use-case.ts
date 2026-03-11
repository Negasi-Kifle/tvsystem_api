import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { ShowHostFilters } from '../../../domain/interfaces/show-host-filters.interface';

export class FetchAllShowHostsUseCase {
  constructor(private readonly repo: IShowHostRepository) {}

  async execute(query: QueryOptions<ShowHostEntity, ShowHostFilters>): Promise<ShowHostEntity[]> {
    return this.repo.findMany(query);
  }
}


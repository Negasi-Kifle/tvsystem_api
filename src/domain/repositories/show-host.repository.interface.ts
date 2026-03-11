import { ShowHostEntity } from '../entities/show-host.entity';
import { IBaseRepository } from './base.repository.interface';
import { QueryOptions } from '../interfaces/query-options.interface';
import { ShowHostFilters } from '../interfaces/show-host-filters.interface';

export interface IShowHostRepository extends IBaseRepository<ShowHostEntity> {
  findByShowAndUser(showId: string, userId: string): Promise<ShowHostEntity | null>;
  findByShow(showId: string): Promise<ShowHostEntity[]>;
}


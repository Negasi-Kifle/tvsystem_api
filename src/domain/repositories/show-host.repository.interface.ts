import { ShowHostEntity } from '../entities/show-host.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IShowHostRepository extends IBaseRepository<ShowHostEntity> {
  findByShowAndUser(showId: string, userId: string): Promise<ShowHostEntity | null>;
  findByShow(showId: string): Promise<ShowHostEntity[]>;
  createMany(entities: Omit<ShowHostEntity, 'id'>[]): Promise<ShowHostEntity[]>;
}


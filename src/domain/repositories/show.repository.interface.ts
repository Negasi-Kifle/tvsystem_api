import { ShowEntity } from '../entities/show.entity';
import { IBaseRepository } from './base.repository.interface';
import { ShowHostEntity } from '../entities/show-host.entity';

export interface IShowRepository extends IBaseRepository<ShowEntity> {
  findByTitleSlug(titleSlug: string): Promise<ShowEntity | null>;
  createWithHosts(show: ShowEntity, hosts: ShowHostEntity[]): Promise<ShowEntity>;
}

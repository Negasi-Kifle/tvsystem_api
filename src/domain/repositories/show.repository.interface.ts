import { ShowEntity } from '../entities/show.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IShowRepository extends IBaseRepository<ShowEntity> {
  findByTitleSlug(titleSlug: string): Promise<ShowEntity | null>;
}

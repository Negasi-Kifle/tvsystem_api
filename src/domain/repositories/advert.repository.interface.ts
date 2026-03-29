import { AdvertEntity } from '../entities/advert.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IAdvertRepository extends IBaseRepository<AdvertEntity> {}

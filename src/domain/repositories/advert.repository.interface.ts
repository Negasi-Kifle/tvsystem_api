import { Advert } from '../entities/advert.entity';

export interface AdvertRepositoryInterface {
  create(advert: Omit<Advert, 'id'>): Promise<Advert>;
  findById(id: string): Promise<Advert | null>;
  updateById(id: string, update: Partial<Advert>): Promise<Advert | null>;
}

import { AdvertRepositoryInterface } from '../../../domain/interfaces/repositories/advert.repository.interface';
import { Advert } from '../../../domain/entities/advert.entity';
import { TenantContext } from '../../../shared/types/tenant-context.type';
import { AdvertModel } from '../mongodb-models/advert.model';
import { BaseRepository } from './base.repository';

export class AdvertRepository extends BaseRepository<Advert> implements AdvertRepositoryInterface {
  constructor() {
    super(AdvertModel);
  }

  async create(advert: Omit<Advert, 'id'>, ctx: TenantContext): Promise<Advert> {
    return super.create(advert as unknown as Omit<Advert, 'tenantId'>, ctx);
  }

  async findById(id: string, ctx: TenantContext): Promise<Advert | null> {
    return super.findOne({ _id: id } as Partial<Advert>, ctx);
  }

  async updateById(id: string, update: Partial<Advert>, ctx: TenantContext): Promise<Advert | null> {
    return super.update({ _id: id } as Partial<Advert>, update, ctx);
  }
}

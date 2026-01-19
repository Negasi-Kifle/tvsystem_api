import { ShowRepositoryInterface } from '../../../domain/interfaces/repositories/show.repository.interface';
import { Show } from '../../../domain/entities/show.entity';
import { TenantContext } from '../../../shared/types/tenant-context.type';
import { ShowModel } from '../mongodb-models/show.model';
import { BaseRepository } from './base.repository';

export class ShowRepository extends BaseRepository<Show> implements ShowRepositoryInterface {
  constructor() {
    super(ShowModel);
  }

  async create(show: Omit<Show, 'id'>, ctx: TenantContext): Promise<Show> {
    return super.create(show as unknown as Omit<Show, 'tenantId'>, ctx);
  }

  async findById(id: string, ctx: TenantContext): Promise<Show | null> {
    return super.findOne({ _id: id } as Partial<Show>, ctx);
  }

  async list(ctx: TenantContext): Promise<Show[]> {
    return super.findMany({}, ctx);
  }
}

import { BaseRepository } from './base.repository';
import { Compensation } from '../../../domain/entities/compensation.entity';
import { CompensationModel } from '../mongodb-models/compensation.model';
import { TenantContext } from '../../../shared/types/tenant-context.type';

export class CompensationRepository extends BaseRepository<Compensation> {
  constructor() {
    super(CompensationModel);
  }

  createCompensation(
    data: Omit<Compensation, 'id'>,
    ctx: TenantContext
  ): Promise<Compensation> {
    return this.create({ ...data, id: '' }, ctx);
  }
}

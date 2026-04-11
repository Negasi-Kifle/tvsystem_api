import { RevenueShareEntity, RevenueShareStatus } from '../../../domain/entities/revenue-share.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IRevenueShareRepository } from '../../../domain/repositories/revenue-share.repository.interface';

export class DisburseRevenueShareUseCase {
  constructor(private readonly revenueShareRepo: IRevenueShareRepository) {}

  async execute(id: string): Promise<RevenueShareEntity | null> {
    const share = await this.revenueShareRepo.findById(id);
    if (!share) {
      throw new EntityNotFoundError('Revenue share not found', 'RevenueShare', id);
    }
    if (share.status === RevenueShareStatus.Disbursed) {
      throw new ValidationError('Revenue share has already been disbursed');
    }

    share.status = RevenueShareStatus.Disbursed;
    share.disbursedDate = new Date();

    return this.revenueShareRepo.update(share);
  }
}

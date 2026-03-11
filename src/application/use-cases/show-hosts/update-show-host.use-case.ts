import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../../domain/errors';
import { RevenueShareType } from '../../../domain/enums';

export type UpdateShowHostInput = {
  revenueShareType?: RevenueShareType;
  revenueShareValue?: number;
  isPrimary?: boolean;
};

export class UpdateShowHostUseCase {
  constructor(private readonly repo: IShowHostRepository) {}

  async execute(id: string, input: UpdateShowHostInput): Promise<ShowHostEntity | null> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Show host assignment not found', 'ShowHost', id);
    }

    const existingPrimary = await this.repo.findMany({ filters: { showId: existing.showId, isPrimary: true } });
    if (existingPrimary.length > 0 && input.isPrimary && existingPrimary[0]!.id! !== id) {
      throw new EntityAlreadyExistsError('Only one primary host per show is allowed', 'ShowHost', `${existing.showId}:${existing.userId}`);
    }

    const updated = ShowHostEntity.createInstance(
      existing.userId,
      existing.showId,
      input.revenueShareType ?? existing.revenueShareType,
      input.revenueShareValue ?? existing.revenueShareValue,
      input.isPrimary ?? existing.isPrimary,
      existing.createdAt,
      new Date(),
      existing.id,
    );

    return this.repo.update(updated);
  }
}


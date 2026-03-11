import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../../domain/errors';
import { RevenueShareType } from '../../../domain/enums';

export type CreateShowHostInput = {
  showId: string;
  userId: string;
  revenueShareType?: RevenueShareType;
  revenueShareValue?: number;
  isPrimary?: boolean;
};

export class CreateShowHostUseCase {
  constructor(
    private readonly showHostRepo: IShowHostRepository,
    private readonly showRepo: IShowRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: CreateShowHostInput): Promise<ShowHostEntity> {
    const [show, user, existing, existingPrimary] = await Promise.all([
      this.showRepo.findById(input.showId),
      this.userRepo.findById(input.userId),
      this.showHostRepo.findByShowAndUser(input.showId, input.userId),
      this.showHostRepo.findMany({ filters: { showId: input.showId, isPrimary: true } }),
    ]);

    if (!show) throw new EntityNotFoundError('Show not found', 'Show', input.showId);
    if (!user) throw new EntityNotFoundError('User not found', 'User', input.userId);
    if (existing) {
      throw new EntityAlreadyExistsError('Host already assigned to this show', 'ShowHost', `${input.showId}:${input.userId}`);
    }
    if (existingPrimary.length > 0) {
      throw new EntityAlreadyExistsError('Only one primary host per show is allowed', 'ShowHost', `${input.showId}:${input.userId}`);
    }

    const entity = ShowHostEntity.createInstance(
      input.userId,
      input.showId,
      input.revenueShareType,
      input.revenueShareValue,
      input.isPrimary ?? false,
    );

    return this.showHostRepo.create(entity);
  }
}


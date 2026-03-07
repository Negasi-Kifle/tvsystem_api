import { ShowEntity } from '../../../domain/entities/show.entity';
import { ShowType } from '../../../domain/enums/show-type.enum';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { Status } from '../../../domain/enums/status';

export type CreateShowInput = {
  title: string;
  titleSlug?: string;
  type: ShowType;
  durationMinutes: number;
  maxAdLengthMinutes: number;
  host: string;
  partsCount: number;
  rerunsCount: number;
  bonusCount: number;
  status?: Status;
};

export class CreateShowUseCase {
  constructor(private readonly showRepo: IShowRepository) { }

  async execute(payload: CreateShowInput): Promise<ShowEntity> {
    const showEntity = ShowEntity.createInstance(
      payload.title,
      payload.titleSlug ?? payload.title.toLowerCase().replace(/ /g, '-'),
      payload.type,
      payload.durationMinutes,
      payload.maxAdLengthMinutes,
      payload.host,
      payload.partsCount,
      payload.rerunsCount,
      payload.bonusCount,
      payload.status
    );

    //  Check for duplicate title slug
    const duplicateShow = await this.showRepo.findByTitleSlug(showEntity.titleSlug);
    if (duplicateShow) {
      throw new EntityAlreadyExistsError('Show with this title slug already exists', 'Show');
    }

      return this.showRepo.create(showEntity);
    }
  }

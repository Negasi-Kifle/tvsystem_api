import { ShowEntity } from '../../../domain/entities/show.entity';
import { ShowType } from '../../../domain/enums/show-type.enum';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { Status } from '../../../domain/enums/status';
import { ValidationError } from '../../../domain/errors/validation.error';

export type CreateShowInput = {
  title: string;
  titleSlug?: string;
  type: ShowType;
  durationMinutes: number;
  maxAdLengthMinutes: number;
  partsCount: number;
  rerunsCount: number;
  bonusCount: number;
  colorForScheduleBlock?: string;
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
      payload.partsCount,
      payload.rerunsCount,
      payload.bonusCount,
      payload.colorForScheduleBlock,
      payload.status
    );

    // Check color for schedule block is a valid hex color
    if(payload.colorForScheduleBlock !== undefined && !ShowEntity.isValidHexColor(payload.colorForScheduleBlock)) {
      throw new ValidationError('Color for schedule block must be a valid hex color. Example: #000000');
    }

    //  Check for duplicate title slug
    const duplicateShow = await this.showRepo.findByTitleSlug(showEntity.titleSlug);
    if (duplicateShow) {
      throw new EntityAlreadyExistsError('Show with this title slug already exists', 'Show');
    }

      return this.showRepo.create(showEntity);
    }
  }

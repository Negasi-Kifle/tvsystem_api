import { ShowEntity } from '../../../domain/entities/show.entity';
import { ShowType } from '../../../domain/enums/show-type.enum';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';



export type CreateShowInput = {
  title: string;
  titleSlug?: string;
  type: ShowType;
  durationMinutes: number;
  maxAdLengthMinutes: number;
  host: string;
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
    );

    //  Check for duplicate title slug
    const duplicateShow = await this.showRepo.findByTitleSlug(showEntity.titleSlug);
    if (duplicateShow) {
      throw new Error('Show with this title slug already exists');
    }

    return this.showRepo.create(showEntity);
  }
}

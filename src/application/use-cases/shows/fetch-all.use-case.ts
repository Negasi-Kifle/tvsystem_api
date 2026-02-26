import { ShowEntity } from '../../../domain/entities/show.entity';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class FetchAllShowsUseCase {
  constructor(private readonly showRepo: IShowRepository) { }

  async execute(query: QueryOptions<ShowEntity, Partial<ShowEntity>>): Promise<ShowEntity[]> {
    return this.showRepo.findMany(query);
  }
}

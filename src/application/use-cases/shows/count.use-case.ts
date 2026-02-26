import { IShowRepository } from "../../../domain/repositories/show.repository.interface";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { ShowEntity } from "../../../domain/entities/show.entity";




export class CountShowsUseCase {
    constructor(private readonly showRepo: IShowRepository) { }

    async execute(query: QueryOptions<ShowEntity, Partial<ShowEntity>>): Promise<number> {
        return await this.showRepo.count(query.filters ?? {});
    }
}
import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";

export class CountMediaPacksUseCase {
    constructor(private readonly mediaPackRepository: IMediaPackRepository) { }

    async execute(query: QueryOptions<MediaPackEntity>): Promise<number> {
        return this.mediaPackRepository.count(query.filters ?? {});
    }
}

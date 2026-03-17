import { MediaPackEntity } from "../../domain/entities/media-pack.entity";
import { QueryOptions } from "../../domain/interfaces/query-options.interface";
import { FetchAllMediaPacksDto } from "../dtos/requests/media-pack/fetch-all.dto";

export function mapFetchAllMediaPacksDtoToQueryOptions(dto: FetchAllMediaPacksDto): QueryOptions<MediaPackEntity> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    return {
        skip: (page - 1) * limit,
        take: limit,
        filters: {
            ...(dto.isActive != null && { isActive: dto.isActive }),
            ...(dto.versionSlug != null && { versionSlug: dto.versionSlug }),
            ...(dto.version != null && { version: dto.version }),
        },
    };
}

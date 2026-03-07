import { ShowEntity } from "../../domain/entities/show.entity";
import { QueryOptions } from "../../domain/interfaces/query-options.interface";
import { FetchAllShowsDto } from "../dtos/requests/show/fetch-all-shows.dto";
import type { ShowFilters } from "../../domain/interfaces/show-filters.interface";

export function mapFetchAllShowsDtoToQueryOptions(dto: FetchAllShowsDto): QueryOptions<ShowEntity, ShowFilters> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  const filters: ShowFilters = {
    ...(dto.title != null && { title: dto.title }),
    ...(dto.titleSlug != null && { titleSlug: dto.titleSlug }),
    ...(dto.type != null && { type: dto.type }),
    ...(dto.minDurationMinutes != null && { minDurationMinutes: dto.minDurationMinutes }),
    ...(dto.maxDurationMinutes != null && { maxDurationMinutes: dto.maxDurationMinutes }),
    ...(dto.minAdLengthMinutes != null && { minAdLengthMinutes: dto.minAdLengthMinutes }),
    ...(dto.maxAdLengthMinutes != null && { maxAdLengthMinutes: dto.maxAdLengthMinutes }),
    ...(dto.minTotalDurationMinutes != null && { minTotalDurationMinutes: dto.minTotalDurationMinutes }),
    ...(dto.maxTotalDurationMinutes != null && { maxTotalDurationMinutes: dto.maxTotalDurationMinutes }),
    ...(dto.partsCount != null && { partsCount: dto.partsCount }),
    ...(dto.rerunsCount != null && { rerunsCount: dto.rerunsCount }),
    ...(dto.bonusCount != null && { bonusCount: dto.bonusCount }),
    ...(dto.host != null && { hostId: dto.host }),
    ...(dto.status != null && { status: dto.status }),
  };

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters,
  };
}
import { CategoryEntity } from "../../domain/entities/category.entity";
import { QueryOptions } from "../../domain/interfaces/query-options.interface";
import { FetchAllCategoriesDto } from "../dtos/requests/category/fetch-all-categories.dto";

export function mapFetchAllCategoriesDtoToQueryOptions(dto: FetchAllCategoriesDto): QueryOptions<CategoryEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.name != null && { name: dto.name }),
      ...(dto.nameSlug != null && { nameSlug: dto.nameSlug }),
    },  
  };
}
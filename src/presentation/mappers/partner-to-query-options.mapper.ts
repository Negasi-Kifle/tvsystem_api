import { PartnerEntity } from "../../domain/entities/partner.entity";
import { QueryOptions } from "../../domain/interfaces/query-options.interface";
import { Percentage } from "../../domain/value-objects/percentage.value-object";
import { FetchAllPartnersDto } from "../dtos/requests/partner/fetch-all";

export function mapFetchAllPartnersDtoToQueryOptions(dto: FetchAllPartnersDto): QueryOptions<PartnerEntity> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    return {
        skip: (page - 1) * limit,
        take: limit,
        filters: {
            ...(dto.revenueShare != null && { revenueShare: new Percentage(dto.revenueShare) }),
            ...(dto.isActive != null && { isActive: dto.isActive }),
        },
    };
}

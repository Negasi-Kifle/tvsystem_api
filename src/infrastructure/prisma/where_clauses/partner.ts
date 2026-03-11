import { Prisma } from "../generated/client";
import { PartnerEntity } from "../../../domain/entities/partner.entity";

export function buildWhereClauseForPartner(filters: Partial<PartnerEntity>): Prisma.PartnerWhereInput {
    if (!filters) return {};

    return {
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
}

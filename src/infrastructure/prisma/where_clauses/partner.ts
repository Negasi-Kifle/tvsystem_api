import { Prisma } from "@prisma/client";
import { PartnerEntity } from "../../../domain/entities/partner.entity";

export function buildWhereClauseForPartner(filters: Partial<PartnerEntity>): Prisma.PartnerWhereInput {
    if (!filters) return {};

    return {
        ...(filters.revenueShare && { revenueShare: { equals: { value: filters.revenueShare.value } } }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
}

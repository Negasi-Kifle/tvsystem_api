import { ShowEntity } from "../../../domain/entities/show.entity";
import { Prisma } from "@prisma/client";
import { ShowType } from "../../../domain/enums/show-type.enum";

export function buildWhereClauseForShow(filters: Partial<ShowEntity>): Prisma.ShowWhereInput {
    if (!filters) return {};

    return {
        ...(filters.title && { title: { contains: filters.title, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.titleSlug && { titleSlug: { contains: filters.titleSlug, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.type && { type: filters.type as ShowType }),
        ...(filters.durationMinutes && { durationMinutes: filters.durationMinutes }),
        ...(filters.maxAdLengthMinutes && { maxAdLengthMinutes: filters.maxAdLengthMinutes }),
        ...(filters.hostId && { hostId: filters.hostId }),
    };
}
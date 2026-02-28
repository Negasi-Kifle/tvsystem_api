import { ShowFilters } from "../../../domain/interfaces/show-filters.interface";
import { Prisma } from "@prisma/client";
import { ShowType } from "../../../domain/enums/show-type.enum";
import { Status } from "../../../domain/enums/status";

export function durationMinutesWhere(filters: ShowFilters): Prisma.IntFilter | undefined {
    const hasMin = filters.minDurationMinutes != null;
    const hasMax = filters.maxDurationMinutes != null;
    if (!hasMin && !hasMax) return undefined;
    return {
        ...(hasMin && { gte: filters.minDurationMinutes }),
        ...(hasMax && { lte: filters.maxDurationMinutes }),
    } as Prisma.IntFilter;
}

function maxAdLengthMinutesWhere(filters: ShowFilters): Prisma.IntFilter | undefined {
    const hasMin = filters.minAdLengthMinutes != null;
    const hasMax = filters.maxAdLengthMinutes != null;
    if (!hasMin && !hasMax) return undefined;
    return {
        ...(hasMin && { gte: filters.minAdLengthMinutes }),
        ...(hasMax && { lte: filters.maxAdLengthMinutes }),
    } as Prisma.IntFilter;
}

export function buildWhereClauseForShow(filters: ShowFilters): Prisma.ShowWhereInput {
    if (!filters) return {};

    const durationWhere = durationMinutesWhere(filters);
    const maxAdWhere = maxAdLengthMinutesWhere(filters);

    return {
        ...(filters.title && { title: { contains: filters.title, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.titleSlug && { titleSlug: { contains: filters.titleSlug, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.type && { type: filters.type as ShowType }),
        ...(durationWhere && { durationMinutes: durationWhere }),
        ...(maxAdWhere && { maxAdLengthMinutes: maxAdWhere }),
        ...(filters.hostId && { hostId: filters.hostId }),
        ...(filters.status && { status: filters.status as Status }),
    };
}
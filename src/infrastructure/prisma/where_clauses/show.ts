import { ShowFilters } from "../../../domain/interfaces/show-filters.interface";
import { Prisma } from "../generated/client";
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

function totalDurationMinutesWhere(filters: ShowFilters): Prisma.IntFilter | undefined {
    const hasMin = filters.minTotalDurationMinutes != null;
    const hasMax = filters.maxTotalDurationMinutes != null;
    if (!hasMin && !hasMax) return undefined;
    return {
        ...(hasMin && { gte: filters.minTotalDurationMinutes }),
        ...(hasMax && { lte: filters.maxTotalDurationMinutes }),
    } as Prisma.IntFilter;
}

export function buildWhereClauseForShow(filters: ShowFilters): Prisma.ShowWhereInput {
    if (!filters) return {};

    const durationWhere = durationMinutesWhere(filters);
    const maxAdWhere = maxAdLengthMinutesWhere(filters);
    const totalDurationWhere = totalDurationMinutesWhere(filters);

    return {
        ...(filters.id !== undefined && (Array.isArray(filters.id) ? { id: { in: filters.id } } : { id: filters.id })),
        ...(filters.title && { title: { contains: filters.title, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.titleSlug && { titleSlug: { contains: filters.titleSlug, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.type && { type: filters.type as ShowType }),
        ...(durationWhere && { durationMinutes: durationWhere }),
        ...(maxAdWhere && { maxAdLengthMinutes: maxAdWhere }),
        ...(totalDurationWhere && { totalDurationMinutes: totalDurationWhere }),
        ...(filters.partsCount != null && { partsCount: filters.partsCount }),
        ...(filters.rerunsCount != null && { rerunsCount: filters.rerunsCount }),
        ...(filters.bonusCount != null && { bonusCount: filters.bonusCount }),
        ...(filters.status && { status: filters.status as Status }),
    };
}
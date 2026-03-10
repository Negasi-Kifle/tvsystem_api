import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { Prisma } from "../generated/client";

export function buildWhereClauseForPermission(filters: Partial<PermissionEntity>): Prisma.PermissionWhereInput {
    if (!filters) return {};

    return {
        ...(filters.name && { name: { contains: filters.name, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.nameSlug && { nameSlug: { contains: filters.nameSlug, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.description && { description: { contains: filters.description, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.isSystemPermission !== undefined && {
            isSystemPermission: filters.isSystemPermission ? 'true' : null,
        }),
    };
}
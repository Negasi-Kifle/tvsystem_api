import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { Prisma } from "../generated/client";

export function buildWhereClauseForUserPermission(filters: Partial<UserPermissionEntity>): Prisma.UserPermissionWhereInput {
    if (!filters) return {};

    return {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.permissionId && { permissionId: filters.permissionId }),
        ...(filters.grantedBy && { grantedBy: filters.grantedBy }),
        ...(filters.expiresAt && { expiresAt: filters.expiresAt }), // TODO: Add date range filter
    };
}
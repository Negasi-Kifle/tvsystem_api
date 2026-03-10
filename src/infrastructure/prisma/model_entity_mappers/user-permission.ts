import { UserPermission } from '../generated/client';
import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { modelToEntity as userModelToEntity } from "./user";
import { modelToEntity as permissionModelToEntity } from "./permission";

/** Prisma UserPermission with optional included relations (use include: { user: true, permission: true } in query) */
export type UserPermissionWithRelations = UserPermission & {
    user?: import('../generated/client').User | null;
    permission?: import('../generated/client').Permission | null;
    grantedByUser?: import('../generated/client').User | null;
};

export function modelToEntity(userPermission: UserPermissionWithRelations): UserPermissionEntity {
    return UserPermissionEntity.createInstance(
        userPermission.userId,
        userPermission.permissionId,
        userPermission.grantedBy ?? undefined,
        userPermission.expiresAt ?? undefined,
        userPermission.createdAt,
        userPermission.updatedAt,
        userPermission.id ?? undefined,
        userPermission.user ? userModelToEntity(userPermission.user) : undefined,
        userPermission.permission ? permissionModelToEntity(userPermission.permission) : undefined,
        userPermission.grantedByUser ? userModelToEntity(userPermission.grantedByUser) : undefined,
    );
}

export function entityToModel(userPermission: UserPermissionEntity): UserPermission {
    return {
        id: userPermission.id ?? '',
        userId: userPermission.userId,
        permissionId: userPermission.permissionId,
        grantedBy: userPermission.grantedBy ?? null,
        expiresAt: userPermission.expiresAt ?? null,
        createdAt: userPermission.createdAt ?? new Date(),
        updatedAt: userPermission.updatedAt ?? new Date(),
    };
}
import { UserPermission } from "@prisma/client";
import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";

export function modelToEntity(userPermission: UserPermission): UserPermissionEntity {
    return UserPermissionEntity.createInstance(
        userPermission.userId,
        userPermission.permissionId,
        userPermission.grantedBy ?? '',
        userPermission.expiresAt ?? new Date(),
        userPermission.createdAt,
        userPermission.updatedAt,
        userPermission.id ?? ''
    )
}


export function entityToModel(userPermission: UserPermissionEntity): UserPermission {
    return {
        id: userPermission.id ?? '',
        userId: userPermission.userId,
        permissionId: userPermission.permissionId,
        grantedBy: userPermission.grantedBy ?? null,
        expiresAt: userPermission.expiresAt ?? null, // null = no expiration
        createdAt: userPermission.createdAt ?? new Date(),
        updatedAt: userPermission.updatedAt ?? new Date(),
    };
}
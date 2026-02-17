import { Permission } from "@prisma/client";
import { PermissionEntity } from "../../../domain/entities/permission.entity";

export function modelToEntity(permission: Permission): PermissionEntity {
    return PermissionEntity.createInstance(
        permission.name,
        permission.nameSlug,
        permission.isSystemPermission ? true : false,
        permission.description ?? undefined,
        permission.createdAt ?? new Date(),
        permission.updatedAt ?? new Date(),
        permission.id ?? undefined,
    );
}


export function entityToModel(permission: PermissionEntity): Permission {
    return {
        id: permission.id ?? '',
        name: permission.name,
        nameSlug: permission.nameSlug,
        isSystemPermission: permission.isSystemPermission ? 'true' : null,
        description: permission.description ?? null,
        createdAt: permission.createdAt ?? new Date(),
        updatedAt: permission.updatedAt ?? new Date(),
    };
}
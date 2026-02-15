import { Permission } from "@prisma/client";
import { PermissionEntity } from "../../../domain/entities/permission.entity";

export function modelToEntity(permission: Permission): PermissionEntity {
    return PermissionEntity.createInstance(
        permission.name,
        permission.nameSlug,
        permission.description ?? undefined,
        permission.createdAt ?? new Date(),
        permission.updatedAt ?? new Date(),
        permission.id ?? '',
        // permission.isSystemPermission ?? true, // TODO: Get back to this once prisma synced
    )
}


export function entityToModel(permission: PermissionEntity): Permission {
    return {
        id: permission.id ?? '',
        name: permission.name,
        nameSlug: permission.nameSlug,
        description: permission.description ?? '',
        createdAt: permission.createdAt ?? new Date(),
        updatedAt: permission.updatedAt ?? new Date(),
        // isSystemPermission: permission.isSystemPermission ?? false, // TODO: Get back to this once prisma synced
    };
}
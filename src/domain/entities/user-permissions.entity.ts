import { ValidationError } from "../errors/validation.error";
import { PermissionEntity } from "./permission.entity";
import { UserEntity } from "./user.entity";

export class UserPermissionEntity {
    constructor(
        public userId: string,
        public permissionId: string,
        public grantedBy?: string,
        public expiresAt?: Date,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public user?: UserEntity,
        public permission?: PermissionEntity,
        public grantedByUser?: UserEntity,
    ) { }

    public static createInstance(
        userId: string, permissionId: string,
        grantedBy?: string, expiresAt?: Date,
        createdAt?: Date, updatedAt?: Date,
        id?: string,
        user?: UserEntity,
        permission?: PermissionEntity,
        grantedByUser?: UserEntity,
    ): UserPermissionEntity {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }
        if (!permissionId) {
            throw new ValidationError('Permission ID is required');
        }

        createdAt = createdAt ?? new Date();
        updatedAt = updatedAt ?? new Date();
        return new UserPermissionEntity(userId, permissionId, grantedBy, expiresAt, createdAt, updatedAt, id, user, permission, grantedByUser);
    }

    public updateInstance(userId?: string, permissionId?: string, grantedBy?: string, expiresAt?: Date): UserPermissionEntity {
        if (userId !== undefined) this.userId = userId;
        if (permissionId !== undefined) this.permissionId = permissionId;
        if (grantedBy !== undefined) this.grantedBy = grantedBy;
        if (expiresAt !== undefined) this.expiresAt = expiresAt;

        this.updatedAt = new Date();
        return this;
    }
}

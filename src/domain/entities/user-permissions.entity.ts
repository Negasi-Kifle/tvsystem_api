export class UserPermissionEntity {
    constructor(
        public userId: string,
        public permissionId: string,
        public grantedBy?: string,
        public expiresAt?: Date,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
    ) { }

    public static createInstance(
        userId: string, permissionId: string,
        grantedBy?: string, expiresAt?: Date,
        createdAt?: Date, updatedAt?: Date, id?: string): UserPermissionEntity {

        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!permissionId) {
            throw new Error('Permission ID is required');
        }


        createdAt = createdAt ?? new Date();
        updatedAt = updatedAt ?? new Date();
        return new UserPermissionEntity(userId, permissionId, grantedBy, expiresAt, createdAt, updatedAt);
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

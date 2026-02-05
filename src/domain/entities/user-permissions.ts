export interface UserPermissionUser {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
}

export interface UserPermissionPermission {
    id: string;
    name: string;
    nameSlug: string;
}

export interface UserPermission {
    id: string;
    userId: string;
    permissionId: string;
    grantedBy?: string;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    // Populated relations
    user: UserPermissionUser;
    permission: UserPermissionPermission;
    grantedByUser?: UserPermissionUser;
}

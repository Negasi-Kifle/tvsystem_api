export interface IUserPermissionUser {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
}

export interface IUserPermissionPermission {
    id: string;
    name: string;
    nameSlug: string;
}
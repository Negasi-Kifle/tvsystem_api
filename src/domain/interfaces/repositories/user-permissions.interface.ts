
import { UserPermissionFilter, UserPermissionQueryOptions } from "../../../infrastructure/database/prisma/repositories/user-permissions.repository";
import { UserPermission } from "../../entities/user-permissions";

// Input type excluding auto-populated relation fields
type UserPermissionInput = Omit<UserPermission, 'id' | 'user' | 'permission' | 'grantedByUser'>;
type UserPermissionUpdate = Partial<Omit<UserPermission, 'user' | 'permission' | 'grantedByUser'>>;

export interface UserPermissionsRepositoryInterface {
    create(userPermission: UserPermissionInput): Promise<UserPermission>;
    findById(id: string): Promise<UserPermission | null>;
    findMany(query: UserPermissionQueryOptions): Promise<UserPermission[]>;
    updateById(id: string, update: UserPermissionUpdate): Promise<UserPermission | null>;
    deleteById(id: string): Promise<UserPermission | null>;
    count(filters?: UserPermissionFilter): Promise<number>;
}
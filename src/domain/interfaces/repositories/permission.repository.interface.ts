
import { Permission } from "../../entities/permission";
import { PermissionFilter, PermissionQueryOptions } from "../../../infrastructure/database/prisma/repositories/permission.repository";

export interface PermissionRepositoryInterface{
    create(permission: Omit<Permission, 'id'>): Promise<Permission>;
    findById(id: string): Promise<Permission | null>;
    findMany(query: PermissionQueryOptions): Promise<Permission[]>;
    updateById(id: string, update: Partial<Permission>): Promise<Permission | null>;
    deleteById(id: string): Promise<Permission | null>;
    count(filters?: PermissionFilter): Promise<number>;
}
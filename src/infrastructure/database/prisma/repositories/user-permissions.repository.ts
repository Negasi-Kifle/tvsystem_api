import { Prisma, UserPermission } from "@prisma/client";
import { UserPermissionsRepositoryInterface } from "../../../../domain/interfaces/repositories/user-permissions.interface";
import { PrismaBaseRepository } from "./base.repository";
import { 
    UserPermission as DomainUserPermission,
    UserPermissionUser,
    UserPermissionPermission
} from "../../../../domain/entities/user-permissions";

// Type for UserPermission with populated relations
type UserPermissionWithRelations = UserPermission & {
    user: {
        id: string;
        fullName: string;
        email: string;
        roles: string[];
    };
    permission: {
        id: string;
        name: string;
        nameSlug: string;
    };
    grantedByUser: {
        id: string;
        fullName: string;
        email: string;
        roles: string[];
    } | null;
};

export interface UserPermissionFilter {
    userId?: string;
    permissionId?: string;
    grantedBy?: string;
    expiresAt?: Date;
}

export interface UserPermissionQueryOptions {
    skip: number;
    take: number;
    filters?: UserPermissionFilter;
}

export class UserPermissionsRepository extends PrismaBaseRepository implements UserPermissionsRepositoryInterface {

    // Include configuration for populating relations
    private readonly includeRelations = {
        user: {
            select: { id: true, fullName: true, email: true, roles: true }
        },
        permission: {
            select: { id: true, name: true, nameSlug: true }
        },
        grantedByUser: {
            select: { id: true, fullName: true, email: true, roles: true }
        }
    };

    private toDomain(record: UserPermissionWithRelations): DomainUserPermission {
        return {
            id: record.id,
            userId: record.userId,
            permissionId: record.permissionId,
            grantedBy: record.grantedBy ?? undefined,
            expiresAt: record.expiresAt ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            // Populated relations
            user: this.toDomainUser(record.user),
            permission: this.toDomainPermission(record.permission),
            grantedByUser: record.grantedByUser ? this.toDomainUser(record.grantedByUser) : undefined
        };
    }

    private toDomainUser(user: { id: string; fullName: string; email: string; roles: string[] }): UserPermissionUser {
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            roles: user.roles
        };
    }

    private toDomainPermission(permission: { id: string; name: string; nameSlug: string }): UserPermissionPermission {
        return {
            id: permission.id,
            name: permission.name,
            nameSlug: permission.nameSlug
        };
    }

    private buildWhereClause(filters?: UserPermissionFilter): Prisma.UserPermissionWhereInput {
        return {
            ...(filters?.userId && { userId: filters.userId }),
            ...(filters?.permissionId && { permissionId: filters.permissionId }),
            ...(filters?.grantedBy && { grantedBy: filters.grantedBy }),
            ...(filters?.expiresAt && { expiresAt: filters.expiresAt }),
        };
    }

    async create(userPermission: Omit<DomainUserPermission, 'id' | 'user' | 'permission' | 'grantedByUser'>): Promise<DomainUserPermission> {
        const createdUserPermission = await this.prisma.userPermission.create({
            data: userPermission,
            include: this.includeRelations
        });

        return this.toDomain(createdUserPermission as UserPermissionWithRelations);
    }

    async findById(id: string): Promise<DomainUserPermission | null> {
        const userPermission = await this.prisma.userPermission.findUnique({
            where: { id },
            include: this.includeRelations
        });

        return userPermission ? this.toDomain(userPermission as UserPermissionWithRelations) : null;
    }

    async updateById(id: string, update: Partial<Omit<DomainUserPermission, 'user' | 'permission' | 'grantedByUser'>>): Promise<DomainUserPermission | null> {
        const existing = await this.prisma.userPermission.findUnique({ where: { id } });
        if (!existing) return null;

        const updatedUserPermission = await this.prisma.userPermission.update({
            where: { id },
            data: update,
            include: this.includeRelations
        });

        return updatedUserPermission ? this.toDomain(updatedUserPermission as UserPermissionWithRelations) : null;
    }

    async deleteById(id: string): Promise<DomainUserPermission | null> {
        const existing = await this.prisma.userPermission.findUnique({ where: { id } });
        if (!existing) return null;

        const deletedUserPermission = await this.prisma.userPermission.delete({
            where: { id },
            include: this.includeRelations
        });

        return deletedUserPermission ? this.toDomain(deletedUserPermission as UserPermissionWithRelations) : null;
    }

    async findMany(query: UserPermissionQueryOptions): Promise<DomainUserPermission[]> {
        const where = this.buildWhereClause(query.filters);
        const userPermissions = await this.prisma.userPermission.findMany({
            where,
            skip: query.skip,
            take: query.take,
            orderBy: { createdAt: 'desc' },
            include: this.includeRelations
        });

        return userPermissions.map((record) => this.toDomain(record as UserPermissionWithRelations));
    }

    async count(filters?: UserPermissionFilter): Promise<number> {
        return await this.prisma.userPermission.count({ where: this.buildWhereClause(filters) });
    }
}

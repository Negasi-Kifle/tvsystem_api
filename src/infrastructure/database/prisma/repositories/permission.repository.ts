import { PermissionRepositoryInterface } from "../../../../domain/interfaces/repositories/permission.repository.interface";
import { PrismaBaseRepository } from "./base.repository";
import { Permission as DomainPermission } from "../../../../domain/entities/permission";
import { Permission } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface PermissionFilter {
    name?: string;
    description?: string;
}

export interface PermissionQueryOptions {
    skip: number;
    take: number;
    filters?: PermissionFilter;
}

export class PermissionRepository extends PrismaBaseRepository implements PermissionRepositoryInterface {


    private buildWhereClause(filters?: PermissionFilter): Prisma.PermissionWhereInput {
        if (!filters) return {};

        return {
            ...(filters?.name && { name: { contains: filters.name, mode: 'insensitive' as Prisma.QueryMode } }),
            ...(filters?.description && { description: { contains: filters.description, mode: 'insensitive' as Prisma.QueryMode } }),
        };
    }

    private toDomain(permission: Permission): DomainPermission {
        return {
            id: permission.id,
            name: permission.name,
            nameSlug: permission.nameSlug,
            description: permission.description ?? undefined,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt
        };
    }


    async create(payload: Omit<DomainPermission, 'id'>): Promise<DomainPermission> {
        // Prepare the nameSlug field 
        const nameSlug = payload.name.toLowerCase().replace(/ /g, '_');
        const permission = await this.prisma.permission.create({
            data: {
                ...payload,
                nameSlug
            }
        });
        return this.toDomain(permission);
    }


    async findById(id: string): Promise<DomainPermission | null> {
        const permission = await this.prisma.permission.findUnique({
            where: { id }
        });
        return permission ? this.toDomain(permission) : null;
    }


    async findMany(query: PermissionQueryOptions): Promise<DomainPermission[]> {
        const where = this.buildWhereClause(query.filters);
        const permissions = await this.prisma.permission.findMany({
            where,
            skip: query.skip,
            take: query.take,
            orderBy: { createdAt: 'desc' }
        });
        return permissions.map(this.toDomain);
    }


    async updateById(id: string, update: Partial<DomainPermission>): Promise<DomainPermission | null> {
        const existing = await this.prisma.permission.findUnique({ where: { id } });
        if (!existing) return null;

        const nameSlug = update.name?.toLowerCase().replace(/ /g, '_');

        const permission = await this.prisma.permission.update({
            where: { id },
            data: {
                ...update,
                nameSlug
            }
        });
        return permission ? this.toDomain(permission) : null;
    }


    async deleteById(id: string): Promise<DomainPermission | null> {
        const existing = await this.prisma.permission.findUnique({ where: { id } });
        if (!existing) return null;

        const prismaPermission = await this.prisma.permission.delete({
            where: { id }
        });
        return prismaPermission ? this.toDomain(prismaPermission) : null;
    }


    async count(filters?: PermissionFilter): Promise<number> { 
        return await this.prisma.permission.count({
            where: this.buildWhereClause(filters)
        });
    }
}
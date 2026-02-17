import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";
import { PrismaBaseRepository } from "./base.repository";
import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { entityToModel } from "../model_entity_mappers/permission";
import { modelToEntity } from "../model_entity_mappers/permission";
import { buildWhereClauseForPermission } from "../where_clauses/permission";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";


export class PermissionRepository extends PrismaBaseRepository implements IPermissionRepository {

    async create(payload: Omit<PermissionEntity, 'id'>): Promise<PermissionEntity> {
        const permissionModel = entityToModel(payload);
        const { id: _omit, ...createData } = permissionModel;
        const savedPermission = await this.prisma.permission.create({ data: createData });
        return modelToEntity(savedPermission);
    }

    async findById(id: string): Promise<PermissionEntity | null> {
        const permission = await this.prisma.permission.findUnique({ where: { id } });
        return permission ? modelToEntity(permission) : null;
    }

    async findMany(query: QueryOptions<PermissionEntity>): Promise<PermissionEntity[]> {
        const where = buildWhereClauseForPermission(query.filters ?? {});
        const permissions = await this.prisma.permission.findMany({ where, skip: query.skip ?? 0, take: query.take ?? 10 });
        return permissions.map(modelToEntity);
    }

    async count(filters?: Partial<PermissionEntity>): Promise<number> {
        const where = buildWhereClauseForPermission(filters ?? {});
        return this.prisma.permission.count({ where });
    }

    async update(entity: PermissionEntity): Promise<PermissionEntity | null> {
        const where = { id: entity.id };
        const data = entityToModel(entity);
        const permission = await this.prisma.permission.update({ where, data });
        return modelToEntity(permission);
    }

    async deleteById(id: string): Promise<PermissionEntity | null> {
        const existing = await this.prisma.permission.findUnique({ where: { id } });
        if (!existing) return null;

        const permission = await this.prisma.permission.delete({ where: { id } });
        return modelToEntity(permission);
    }

    async findPermissionsBySlugs(slugs: string[]): Promise<PermissionEntity[]> {
        if (slugs.length === 0) return [];
        const permissions = await this.prisma.permission.findMany({
            where: { nameSlug: { in: slugs } },
        });
        return permissions.map(modelToEntity);
    }

    async upsertByNameSlug(name: string, nameSlug: string): Promise<PermissionEntity> {
        const permission = await this.prisma.permission.upsert({
            where: { nameSlug },
            create: { name, nameSlug },
            update: { nameSlug },
        });
        return modelToEntity(permission);
    }
}
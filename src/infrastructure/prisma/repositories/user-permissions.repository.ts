import { PrismaBaseRepository } from "./base.repository";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";
import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { modelToEntity } from "../model_entity_mappers/user-permission";
import { entityToModel } from "../model_entity_mappers/user-permission";
import { buildWhereClauseForUserPermission } from "../where_clauses/user-permission";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class UserPermissionsRepository extends PrismaBaseRepository implements IUserPermissionsRepository {

    async create(userPermission: Omit<UserPermissionEntity, 'id'>): Promise<UserPermissionEntity> {
        const userPermissionModel = entityToModel(userPermission);

        const { id: _omit, ...createData } = userPermissionModel; // Omit id so DB generates it via @default(uuid())
        const savedUserPermission = await this.prisma.userPermission.create({ data: createData });
        return modelToEntity(savedUserPermission);
    }

    async findById(id: string): Promise<UserPermissionEntity | null> {
        const userPermission = await this.prisma.userPermission.findUnique({ where: { id } });
        return userPermission ? modelToEntity(userPermission) : null;
    }

    async findMany(query: QueryOptions<UserPermissionEntity>): Promise<UserPermissionEntity[]> {
        const where = buildWhereClauseForUserPermission(query.filters ?? {});
        const userPermissions = await this.prisma.userPermission.findMany({
            where,
            skip: query.skip ?? 0,
            take: query.take ?? 10,
            include: { permission: true },
        });
        return userPermissions.map(modelToEntity);
    }

    async count(filters?: Partial<UserPermissionEntity>): Promise<number> {
        const where = buildWhereClauseForUserPermission(filters ?? {});
        return this.prisma.userPermission.count({ where });
    }

    async update(userPermission: UserPermissionEntity): Promise<UserPermissionEntity | null> {
        const where = { id: userPermission.id };
        const data = entityToModel(userPermission);
        const updatedUserPermission = await this.prisma.userPermission.update({ where, data });
        return modelToEntity(updatedUserPermission);
    }

    async deleteById(id: string): Promise<UserPermissionEntity | null> {
        const userPermission = await this.prisma.userPermission.delete({ where: { id } });
        return userPermission ? modelToEntity(userPermission) : null;
    }

    async findPermissionSlugsByUserId(userId: string): Promise<string[]> {
        const userPermissions = await this.prisma.userPermission.findMany({
            where: {
                userId,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } },
                ],
            },
            include: { permission: true },
        });
        return userPermissions.map((up) => up.permission.nameSlug);
    }
}
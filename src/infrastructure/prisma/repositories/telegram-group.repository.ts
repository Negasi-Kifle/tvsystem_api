import { PrismaBaseRepository } from "./base.repository";
import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { entityToModel, modelToEntity } from "../model_entity_mappers/telegram-group";
import { buildWhereClauseForTelegramGroup } from "../where_clauses/telegram-group";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";


export class TelegramGroupRepository extends PrismaBaseRepository implements ITelegramGroupRepository {
    async create(telegramGroup: Omit<TelegramGroupEntity, 'id'>): Promise<TelegramGroupEntity> {
        const telegramGroupModel = entityToModel(telegramGroup);
        const savedTelegramGroup = await this.prisma.telegramGroup.create({ data: telegramGroupModel });
        return modelToEntity(savedTelegramGroup);
    }

    async findById(id: string): Promise<TelegramGroupEntity | null> {
        const telegramGroup = await this.prisma.telegramGroup.findUnique({ where: { id } });
        return telegramGroup ? modelToEntity(telegramGroup) : null;
    }

    async findMany(query: QueryOptions<TelegramGroupEntity>): Promise<TelegramGroupEntity[]> {
        const where = buildWhereClauseForTelegramGroup(query.filters ?? {});
        const telegramGroups = await this.prisma.telegramGroup.findMany({ where, skip: query.skip ?? 0, take: query.take ?? 10 });
        return telegramGroups.map(modelToEntity);
    }

    async count(filters?: Partial<TelegramGroupEntity>): Promise<number> {
        const where = buildWhereClauseForTelegramGroup(filters ?? {});
        return this.prisma.telegramGroup.count({ where });
    }

    async update(telegramGroup: TelegramGroupEntity): Promise<TelegramGroupEntity | null> {
        const where = { id: telegramGroup.id };
        const data = entityToModel(telegramGroup);
        const updatedTelegramGroup = await this.prisma.telegramGroup.update({ where, data });
        return modelToEntity(updatedTelegramGroup);
    }

    async deleteById(id: string): Promise<TelegramGroupEntity | null> {
        const telegramGroup = await this.prisma.telegramGroup.delete({ where: { id } });
        return telegramGroup ? modelToEntity(telegramGroup) : null;
    }
}
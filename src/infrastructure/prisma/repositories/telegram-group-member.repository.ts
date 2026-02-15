import { PrismaBaseRepository } from "./base.repository";
import { ITelegramGroupMembersRepository } from "../../../domain/repositories/telegram-group-members.repo";
import { entityToModel, modelToEntity } from "../model_entity_mappers/telegram-group-member";
import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { buildWhereClauseForTelegramGroupMember } from "../where_clauses/telegram-group-member";

export class TelegramGroupMemberRepository extends PrismaBaseRepository implements ITelegramGroupMembersRepository {

    async create(telegramGroupMember: Omit<TelegramGroupMemberEntity, 'id'>): Promise<TelegramGroupMemberEntity> {
        const telegramGroupMemberModel = entityToModel(telegramGroupMember);
        const savedTelegramGroupMember = await this.prisma.telegramGroupMember.create({ data: telegramGroupMemberModel });
        return modelToEntity(savedTelegramGroupMember);
    }

    async findById(id: string): Promise<TelegramGroupMemberEntity | null> {
        const telegramGroupMember = await this.prisma.telegramGroupMember.findUnique({ where: { id } });
        return telegramGroupMember ? modelToEntity(telegramGroupMember) : null;
    }

    async findMany(query: QueryOptions<TelegramGroupMemberEntity>): Promise<TelegramGroupMemberEntity[]> {
        const where = buildWhereClauseForTelegramGroupMember(query.filters ?? {});
        const telegramGroupMembers = await this.prisma.telegramGroupMember.findMany({ where, skip: query.skip ?? 0, take: query.take ?? 10 });
        return telegramGroupMembers.map(modelToEntity);
    }

    async count(filters?: Partial<TelegramGroupMemberEntity>): Promise<number> {
        const where = buildWhereClauseForTelegramGroupMember(filters ?? {});
        return this.prisma.telegramGroupMember.count({ where });
    }

    async update(telegramGroupMember: TelegramGroupMemberEntity): Promise<TelegramGroupMemberEntity | null> {
        const where = { id: telegramGroupMember.id };
        const data = entityToModel(telegramGroupMember);
        const updatedTelegramGroupMember = await this.prisma.telegramGroupMember.update({ where, data });
        return modelToEntity(updatedTelegramGroupMember);
    }

    async deleteById(id: string): Promise<TelegramGroupMemberEntity | null> {
        const telegramGroupMember = await this.prisma.telegramGroupMember.delete({ where: { id } });
        return telegramGroupMember ? modelToEntity(telegramGroupMember) : null;
    }
}
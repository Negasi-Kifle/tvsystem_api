import { PrismaBaseRepository } from "./base.repository";
import { Prisma, TelegramGroup } from "@prisma/client";
import { TelegramGroup as DomainTelegramGroup } from "../../../../domain/entities/telegram-groups.entity";
import { TelegramGroupRepositoryInterface } from "../../../../domain/interfaces/repositories/telegram-group.interface";


export interface TelegramGroupFilter{
    groupName?: string;
    groupChatId?: string;
    groupLink?: string;
    isActive?: boolean;
}

export interface TelegramGroupQueryOptions {
    skip: number;
    take: number;
    filters?: TelegramGroupFilter;
}

export class TelegramGroupRepository extends PrismaBaseRepository implements TelegramGroupRepositoryInterface {
 
    /**
     * Build Prisma where clause from filters
     * @param filters - Telegram group filters
     * @returns Prisma where clause
     */
    private buildWhereClause(filters?: TelegramGroupFilter): Prisma.TelegramGroupWhereInput {
        if (!filters) return {};

        return {
            ...(filters.groupName && { groupName: { contains: filters.groupName, mode: 'insensitive' as Prisma.QueryMode } }),
            ...(filters.groupChatId && { groupChatId: filters.groupChatId }),
            ...(filters.groupLink && { groupLink: filters.groupLink }),
            ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        };
    }



    /**
     * Map prisma telegram group to domain telegram group
     * @param telegramGroup - Prisma telegram group
     * @returns Domain telegram group
     */
    private toDomain(telegramGroup: TelegramGroup): DomainTelegramGroup {
        return {
            id: telegramGroup.id,
            groupName: telegramGroup.groupName,
            groupChatId: telegramGroup.groupChatId ?? '',
            groupLink: telegramGroup.groupLink,
            description: telegramGroup.description ?? '',
            isActive: telegramGroup.isActive,
            createdAt: telegramGroup.createdAt,
            updatedAt: telegramGroup.updatedAt,
        };
    }

    async create(telegramGroup: Omit<DomainTelegramGroup, 'id'>): Promise<DomainTelegramGroup> {
        const prismaTelegramGroup = await this.prisma.telegramGroup.create({
            data: {
                groupName: telegramGroup.groupName,
                groupChatId: telegramGroup.groupChatId ?? '',
                groupLink: telegramGroup.groupLink,
                description: telegramGroup.description ?? '',
                isActive: telegramGroup.isActive,
            },
        });
        return this.toDomain(prismaTelegramGroup as TelegramGroup);
    }


    async updateById(id: string, update: Partial<DomainTelegramGroup>): Promise<DomainTelegramGroup | null> {
        const existing = await this.prisma.telegramGroup.findUnique({
            where: { id },
        });
        
        if (!existing) return null;

        const telegramGroup = await this.prisma.telegramGroup.update({
            where: { id },
            data: {
                ...(update.groupName !== undefined && { groupName: update.groupName }),
                ...(update.groupChatId !== undefined && { groupChatId: update.groupChatId }),
                ...(update.groupLink !== undefined && { groupLink: update.groupLink }),
                ...(update.description !== undefined && { description: update.description }),
                ...(update.isActive !== undefined && { isActive: update.isActive }),
            },
        });
        return this.toDomain(telegramGroup as TelegramGroup);
    }


    async findById(id: string): Promise<DomainTelegramGroup | null> {
        const prismaTelegramGroup = await this.prisma.telegramGroup.findUnique({
            where: { id },
        });
        return prismaTelegramGroup ? this.toDomain(prismaTelegramGroup as TelegramGroup) : null;
    }


    async findMany(query: TelegramGroupQueryOptions): Promise<DomainTelegramGroup[]> {
        const where = this.buildWhereClause(query.filters);
        const telegramGroups = await this.prisma.telegramGroup.findMany({
            where,
            skip: query.skip,
            take: query.take,
            orderBy: { createdAt: 'desc' }
        });
        return telegramGroups.map(this.toDomain);
    }


    async delete(id: string): Promise<DomainTelegramGroup | null> {
        const existing = await this.prisma.telegramGroup.findUnique({
            where: { id },
        });
        
        if (!existing) return null;

        const prismaTelegramGroup = await this.prisma.telegramGroup.delete({
            where: { id },
        });
        return this.toDomain(prismaTelegramGroup as TelegramGroup);
    }

    async count(filters?: TelegramGroupFilter): Promise<number> {
        return await this.prisma.telegramGroup.count({
            where: this.buildWhereClause(filters),
        });
    }
}
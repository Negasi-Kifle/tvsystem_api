import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { Prisma } from "@prisma/client";

export function buildWhereClauseForTelegramGroup(filters: Partial<TelegramGroupEntity>): Prisma.TelegramGroupWhereInput {
    if (!filters) return {};

    return {
        ...(filters.groupName && { groupName: { contains: filters.groupName, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.groupChatId && { groupChatId: filters.groupChatId }),
        ...(filters.groupLink && { groupLink: { contains: filters.groupLink, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
}
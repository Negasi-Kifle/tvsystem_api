import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { Prisma } from "@prisma/client";

export function buildWhereClauseForTelegramGroupMember(filters: Partial<TelegramGroupMemberEntity>): Prisma.TelegramGroupMemberWhereInput {
    if (!filters) return {};

    return {
        ...(filters.telegramGroupId && { telegramGroupId: filters.telegramGroupId }),
        ...(filters.userId && { userId: filters.userId }),
    };
}
import { TelegramGroupMember } from "@prisma/client";
import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";

export function modelToEntity(telegramGroupMember: TelegramGroupMember): TelegramGroupMemberEntity {
    return TelegramGroupMemberEntity.createInstance(
        telegramGroupMember.telegramGroupId,
        telegramGroupMember.userId,
        telegramGroupMember.createdAt ?? new Date(),
        telegramGroupMember.updatedAt ?? new Date(),
        telegramGroupMember.id ?? '',
    )
}


export function entityToModel(telegramGroupMember: TelegramGroupMemberEntity): TelegramGroupMember {
    return {
        id: telegramGroupMember.id ?? '',
        telegramGroupId: telegramGroupMember.telegramGroupId,
        userId: telegramGroupMember.userId,
        createdAt: telegramGroupMember.createdAt ?? new Date(),
        updatedAt: telegramGroupMember.updatedAt ?? new Date(),
    };
}
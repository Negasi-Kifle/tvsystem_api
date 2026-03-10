import { TelegramGroup } from '../generated/client';
import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";

export function modelToEntity(telegramGroup: TelegramGroup): TelegramGroupEntity {
    return TelegramGroupEntity.createInstance(
        telegramGroup.groupName,
        telegramGroup.groupLink,
        telegramGroup.isActive,
        telegramGroup.groupChatId ?? '',
        telegramGroup.description ?? '',
        telegramGroup.createdAt ?? new Date(),
        telegramGroup.updatedAt ?? new Date(),
        telegramGroup.id ?? '',
    )
}


export function entityToModel(telegramGroup: TelegramGroupEntity): TelegramGroup {
    return {
        id: telegramGroup.id ?? '',
        groupName: telegramGroup.groupName,
        groupChatId: telegramGroup.groupChatId ?? '',
        groupLink: telegramGroup.groupLink,
        description: telegramGroup.description ?? '',
        isActive: telegramGroup.isActive,
        createdAt: telegramGroup.createdAt ?? new Date(),
        updatedAt: telegramGroup.updatedAt ?? new Date(),
    };
}
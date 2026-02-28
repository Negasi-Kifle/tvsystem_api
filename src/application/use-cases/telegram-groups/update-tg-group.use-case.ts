import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";

export class UpdateTgGroupUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(id: string, payload: Partial<TelegramGroupEntity>): Promise<TelegramGroupEntity | null> {
        const telegramGroup = await this.telegramGroupRepo.findById(id);
        if (!telegramGroup) {
            throw new EntityNotFoundError('Telegram group not found', 'TelegramGroup', id);
        }

        const updatedTelegramGroup = telegramGroup.updateInstance(
            payload.groupName, payload.groupLink,
            payload.isActive, payload.groupChatId,
            payload.description);

        return await this.telegramGroupRepo.update(updatedTelegramGroup);
    }
}
import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";

export class DeleteTgGroupUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(id: string): Promise<TelegramGroupEntity | null> {
        // Check if the telegram group exists
        const telegramGroup = await this.telegramGroupRepo.findById(id);
        if (!telegramGroup) {
            throw new EntityNotFoundError('Telegram group not found', 'TelegramGroup', id);
        }

        return await this.telegramGroupRepo.deleteById(id)
    }
}
import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";

export class DeleteTgGroupUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(id: string): Promise<TelegramGroupEntity | null> {
        // Check if the telegram group exists
        const telegramGroup = await this.telegramGroupRepo.findById(id);
        if (!telegramGroup) {
            throw new Error('Telegram group not found');
        }

        return await this.telegramGroupRepo.deleteById(id)
    }
}
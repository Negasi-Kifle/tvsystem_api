import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";
import { EntityNotFoundError } from "../../../domain/errors";

export class GetTgGroupByIdUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(id: string): Promise<TelegramGroupEntity | null> {
        const telegramGroup = await this.telegramGroupRepo.findById(id);
        if (!telegramGroup) {
            throw new EntityNotFoundError('Telegram group not found', 'TelegramGroup', id);
        }
        return telegramGroup;
    }
}
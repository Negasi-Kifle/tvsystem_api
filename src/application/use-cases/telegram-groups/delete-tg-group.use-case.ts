import { TelegramGroup } from "../../../domain/entities/telegram-groups.entity";
import { TelegramGroupRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";

export class DeleteTgGroupUseCase {
    constructor(private readonly telegramGroupRepo = new TelegramGroupRepository()) { }

    async execute(id: string): Promise<TelegramGroup | null> {
        return await this.telegramGroupRepo.delete(id);
    }
}
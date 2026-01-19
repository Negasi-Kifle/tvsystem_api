import { TelegramGroupRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";
import { TelegramGroup } from "../../../domain/entities/telegram-groups.entity";

export class UpdateTgGroupUseCase {
    constructor(private readonly telegramGroupRepo = new TelegramGroupRepository()) { }

    async execute(id: string, payload: Partial<TelegramGroup>): Promise<TelegramGroup | null> {
        return await this.telegramGroupRepo.updateById(id, payload);
    }
}
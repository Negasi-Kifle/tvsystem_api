import { TelegramGroupRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";
import { TelegramGroup } from "../../../domain/entities/telegram-groups.entity";

export class GetTgGroupByIdUseCase {
    constructor(private readonly telegramGroupRepo = new TelegramGroupRepository()) { }

    async execute(id: string): Promise<TelegramGroup | null> {
        return await this.telegramGroupRepo.findById(id);
    }
}
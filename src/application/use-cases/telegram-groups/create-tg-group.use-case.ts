import { TelegramGroupRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";
import { TelegramGroup } from "../../../domain/entities/telegram-groups.entity";


export class CreateTgGroupUseCase {
    constructor(private readonly telegramGroupRepo = new TelegramGroupRepository()) { }

    async execute(payload: Omit<TelegramGroup, 'id'>): Promise<TelegramGroup> {
        return this.telegramGroupRepo.create(payload);
    }
}
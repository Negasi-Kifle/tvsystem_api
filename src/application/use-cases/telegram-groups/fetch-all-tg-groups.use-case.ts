import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";

export class FetchAllTgGroupsUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(query: QueryOptions<TelegramGroupEntity, Partial<TelegramGroupEntity>>): Promise<TelegramGroupEntity[]> {
        return await this.telegramGroupRepo.findMany(query);
    }
}
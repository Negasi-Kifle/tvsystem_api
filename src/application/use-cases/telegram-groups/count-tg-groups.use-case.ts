import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";

export class CountTgGroupsUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(query: QueryOptions<TelegramGroupEntity, Partial<TelegramGroupEntity>>): Promise<number> {
        return await this.telegramGroupRepo.count(query.filters ?? {});
    }
}
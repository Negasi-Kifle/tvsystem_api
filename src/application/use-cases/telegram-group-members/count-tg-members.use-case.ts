import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { ITelegramGroupMembersRepository } from "../../../domain/repositories/telegram-group-members.repo";

export class CountTelegramGroupMembersUseCase {
    constructor(private readonly telegramGroupMembersRepository: ITelegramGroupMembersRepository) { }

    async execute(query: QueryOptions<TelegramGroupMemberEntity, Partial<TelegramGroupMemberEntity>>): Promise<number> {
        return await this.telegramGroupMembersRepository.count(query.filters ?? {});
    }
}
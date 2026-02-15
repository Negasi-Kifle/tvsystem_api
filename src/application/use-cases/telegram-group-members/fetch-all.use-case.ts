import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { ITelegramGroupMembersRepository } from "../../../domain/repositories/telegram-group-members.repo";

export class FetchAllTelegramGroupMembersUseCase {
    constructor(private readonly telegramGroupMembersRepository: ITelegramGroupMembersRepository) { }

    async execute(query: QueryOptions<TelegramGroupMemberEntity, Partial<TelegramGroupMemberEntity>>): Promise<TelegramGroupMemberEntity[]> {
        return await this.telegramGroupMembersRepository.findMany(query);
    }
}
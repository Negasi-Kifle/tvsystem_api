import { TelegramGroupMemberFilter, TelegramGroupMemberRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group-member.repository";
import { FetchAllTgMembersDto } from "../../../presentation/dtos/requests/fetch-all-tg-members.dto";

export class CountTgMembersUseCase {
    constructor(private readonly telegramGroupMembersRepository = new TelegramGroupMemberRepository()) { }

    async execute(query: FetchAllTgMembersDto): Promise<number> {
        // Build filters from query params
        const filters: TelegramGroupMemberFilter = {
            ...(query.userId && { userId: query.userId }),
            ...(query.telegramGroupId && { telegramGroupId: query.telegramGroupId }),
        };

        return await this.telegramGroupMembersRepository.count(filters);
    }
}
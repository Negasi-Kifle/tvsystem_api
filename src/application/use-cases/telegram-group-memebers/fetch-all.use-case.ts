import { TelegramGroupMember } from "../../../domain/entities/telegram-group-member.entity";
import { TelegramGroupMemberFilter, TelegramGroupMemberQueryOptions, TelegramGroupMemberRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group-member.repository";
import { FetchAllTgMembersDto } from "../../../presentation/dtos/requests/fetch-all-tg-members.dto";

export class FetchAllTelegramGroupMembersUseCase {
    constructor(private readonly telegramGroupMembersRepository = new TelegramGroupMemberRepository()) {}

    async execute(query: FetchAllTgMembersDto): Promise<TelegramGroupMember[]> {
        // Build filters from query params
        const filters: TelegramGroupMemberFilter = {
            ...(query.userId && { userId: query.userId }),
            ...(query.telegramGroupId && { telegramGroupId: query.telegramGroupId }),
        };

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        return await this.telegramGroupMembersRepository.findMany({
            skip: (page - 1) * limit,
            take: limit,
            filters
        });
    }
}
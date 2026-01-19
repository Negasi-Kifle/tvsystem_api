import { TelegramGroupFilter, TelegramGroupRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";
import { FetchAllTgGroupsDto } from "../../../presentation/dtos/requests/fetch-all-tg-groups.dto";

export class CountTgGroupsUseCase {
    constructor(private readonly telegramGroupRepo = new TelegramGroupRepository()) { }

    async execute(query: FetchAllTgGroupsDto): Promise<number> {
        // Build filters from query params
        const filters: TelegramGroupFilter = {
            ...(query.groupName && { groupName: query.groupName }),
            ...(query.groupChatId && { groupChatId: query.groupChatId }),
            ...(query.groupLink && { groupLink: query.groupLink }),
            ...(query.isActive !== undefined && { isActive: query.isActive })
        };
        return this.telegramGroupRepo.count(filters);
    }
}
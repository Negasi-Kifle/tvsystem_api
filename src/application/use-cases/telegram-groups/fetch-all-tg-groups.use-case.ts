import { TelegramGroup } from "../../../domain/entities/telegram-groups.entity";
import { TelegramGroupFilter, TelegramGroupRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";
import { FetchAllTgGroupsDto } from "../../../presentation/dtos/requests/fetch-all-tg-groups.dto";

export class FetchAllTgGroupsUseCase {
    constructor(private readonly telegramGroupRepo = new TelegramGroupRepository()) {}

    async execute(query: FetchAllTgGroupsDto): Promise<TelegramGroup[]> {
        // Build filters from query params
        const filters: TelegramGroupFilter = {
            ...(query.groupName && { groupName: query.groupName }),
            ...(query.groupChatId && { groupChatId: query.groupChatId }),
            ...(query.groupLink && { groupLink: query.groupLink }),
            ...(query.isActive !== undefined && { isActive: query.isActive })
        };
        
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const telegramGroups = await this.telegramGroupRepo.findMany({
            skip: (page - 1) * limit,
            take: limit,
            filters
        });

        return telegramGroups;
    }
}
import { TelegramGroupEntity } from "../../../domain/entities/telegram-groups.entity";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";



export type CreateTgGroupInput = {
    groupName: string;
    groupLink: string;
    isActive: boolean;
    groupChatId?: string;
    description?: string;
};

export class CreateTgGroupUseCase {
    constructor(private readonly telegramGroupRepo: ITelegramGroupRepository) { }

    async execute(payload: CreateTgGroupInput): Promise<TelegramGroupEntity> {
        const telegramGroupEntity = TelegramGroupEntity.createInstance(
            payload.groupName,
            payload.groupLink,
            payload.isActive,
            payload.groupChatId,
            payload.description,
        );
        return await this.telegramGroupRepo.create(telegramGroupEntity);
    }
}
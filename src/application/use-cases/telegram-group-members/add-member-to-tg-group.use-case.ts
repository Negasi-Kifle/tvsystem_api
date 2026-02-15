import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { ITelegramGroupMembersRepository } from "../../../domain/repositories/telegram-group-members.repo";
import { ITelegramGroupRepository } from "../../../domain/repositories/telegram-group.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";

export class AddMemberToTelegramGroupUseCase {
    constructor(private readonly telegramGroupMembersRepository: ITelegramGroupMembersRepository,
        private readonly telegramGroupRepository: ITelegramGroupRepository,
        private readonly userRepository: IUserRepository) { }

    async execute(userId: string, telegramGroupId: string): Promise<TelegramGroupMemberEntity> {
        const telegramGroupMemberEntity = TelegramGroupMemberEntity.createInstance(telegramGroupId, userId);

        // Check if the user is already a member of the telegram group
        const [existingTelegramGroupMember, telegramGroupExists, userExists] = await Promise.all([
            this.telegramGroupMembersRepository.findMany({
                filters: {
                    userId,
                    telegramGroupId,
                },
            }),
            this.telegramGroupRepository.findById(telegramGroupId),
            this.userRepository.findById(userId),
        ]);

        if (existingTelegramGroupMember.length > 0) {
            throw new Error('User is already a member of the telegram group');
        }

        if (!telegramGroupExists) {
            throw new Error('Telegram group not found');
        }

        if (!userExists) {
            throw new Error('User not found');
        }

        return await this.telegramGroupMembersRepository.create(telegramGroupMemberEntity);
    }
}
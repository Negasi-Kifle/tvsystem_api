import { TelegramGroupMember } from "../../../domain/entities/telegram-group-member.entity";
import { TelegramGroupMemberRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group-member.repository";

export class AddMemberToTelegramGroupUseCase {
    constructor(private readonly telegramGroupMembersRepository = new TelegramGroupMemberRepository()) {}

    async execute(userId: string, telegramGroupId: string): Promise<TelegramGroupMember> {
        return await this.telegramGroupMembersRepository.addToTelegramGroup(userId, telegramGroupId);
    }
}
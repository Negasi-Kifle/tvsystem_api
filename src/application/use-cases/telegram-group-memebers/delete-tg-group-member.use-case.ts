import { TelegramGroupMember } from "../../../domain/entities/telegram-group-member.entity";
import { TelegramGroupMemberRepository } from "../../../infrastructure/database/prisma/repositories/telegram-group-member.repository";

export class DeleteTgMemberByIdUseCase {
    constructor(private readonly telegramGroupMembersRepository = new TelegramGroupMemberRepository()) {}

    async execute(id: string): Promise<TelegramGroupMember | null> {
        return await this.telegramGroupMembersRepository.deleteTelegramGroupMember(id);
    }
}
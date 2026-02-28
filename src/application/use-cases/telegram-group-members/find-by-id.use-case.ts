import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { ITelegramGroupMembersRepository } from "../../../domain/repositories/telegram-group-members.repo";

export class FindTelegramGroupMemberByIdUseCase {
    constructor(private readonly telegramGroupMembersRepository: ITelegramGroupMembersRepository) { }

    async execute(id: string): Promise<TelegramGroupMemberEntity | null> {
        const telegramGroupMember = await this.telegramGroupMembersRepository.findById(id);
        if (!telegramGroupMember) {
            throw new EntityNotFoundError('Telegram-group-member not found');
        }

        return telegramGroupMember;
    }
}
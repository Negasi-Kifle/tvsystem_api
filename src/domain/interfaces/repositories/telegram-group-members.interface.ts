import { TelegramGroupMemberFilter, TelegramGroupMemberQueryOptions } from "../../../infrastructure/database/prisma/repositories/telegram-group-member.repository";
import { TelegramGroupMember } from "../../entities/telegram-group-member.entity";

export interface TelegramGroupMembersRepositoryInterface {
    addToTelegramGroup(userId: string, telegramGroupId: string): Promise<TelegramGroupMember>;
    deleteTelegramGroupMember(id: string): Promise<TelegramGroupMember | null>;
    findMany(query: TelegramGroupMemberQueryOptions): Promise<TelegramGroupMember[]>;
    findById(id: string): Promise<TelegramGroupMember | null>;
    count(filters?: TelegramGroupMemberFilter): Promise<number>;
}
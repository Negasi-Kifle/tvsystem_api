import { TelegramGroupFilter, TelegramGroupQueryOptions } from "../../../infrastructure/database/prisma/repositories/telegram-group.repository";
import { TelegramGroup } from "../../entities/telegram-groups.entity";

export interface TelegramGroupRepositoryInterface {
    create(telegramGroup: TelegramGroup): Promise<TelegramGroup>;
    updateById(id: string, update: Partial<TelegramGroup>): Promise<TelegramGroup | null>;
    findById(id: string): Promise<TelegramGroup | null>;
    findMany(query: TelegramGroupQueryOptions): Promise<TelegramGroup[]>;
    delete(id: string): Promise<TelegramGroup | null>;
    count(filters?: TelegramGroupFilter): Promise<number>;
}
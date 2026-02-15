import { TelegramGroupEntity } from './telegram-groups.entity';
import { UserSummary } from '../interfaces/user-summary.interface';

export class TelegramGroupMemberEntity {
    constructor(
        public telegramGroupId: string,
        public userId: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
    ) { }

    public static createInstance(
        telegramGroupId: string,
        userId: string,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
    ): TelegramGroupMemberEntity {
        if (!telegramGroupId) {
            throw new Error('Telegram group ID is required');
        }

        if (!userId) {
            throw new Error('User ID is required');
        }

        createdAt = createdAt ?? new Date();
        updatedAt = updatedAt ?? new Date();
        return new TelegramGroupMemberEntity(telegramGroupId, userId, createdAt, updatedAt, id);
    }

    public updateInstance(telegramGroupId?: string, userId?: string): TelegramGroupMemberEntity {
        if (telegramGroupId !== undefined) this.telegramGroupId = telegramGroupId;
        if (userId !== undefined) this.userId = userId;
        this.updatedAt = new Date();
        return this;
    }
}

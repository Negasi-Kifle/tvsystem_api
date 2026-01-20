import { TelegramGroup } from './telegram-groups.entity';
import { SexTypes } from '../enums/sex-types.enum';

/**
 * Summary of user data for populated relations (excludes sensitive fields)
 */
export interface UserSummary {
    id: string;
    email: string;
    fullName: string;
    sex: SexTypes;
    phoneNumber: string;
    isActive: boolean;
}

export interface TelegramGroupMember {
    id: string;
    telegramGroupId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user?: UserSummary;
    telegramGroup?: TelegramGroup;
}

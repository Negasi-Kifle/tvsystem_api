export interface TelegramGroup {
    id: string;
    groupName: string;
    groupChatId?: string;
    groupLink: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
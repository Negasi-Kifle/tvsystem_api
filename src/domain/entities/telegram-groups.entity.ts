export class TelegramGroupEntity {
    constructor(
        public groupName: string,
        public groupLink: string,
        public isActive: boolean = true,
        public groupChatId?: string,
        public description?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
    ) { }

    public static createInstance(
        groupName: string,
        groupLink: string,
        isActive: boolean = true,
        groupChatId?: string,
        description?: string,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
    ): TelegramGroupEntity {

        if (!groupName) {
            throw new Error('Group name is required');
        }

        if (!groupLink) {
            throw new Error('Group link is required');
        }

        createdAt = createdAt ?? new Date();
        updatedAt = updatedAt ?? new Date();
        return new TelegramGroupEntity(groupName, groupLink, isActive, groupChatId, description, createdAt, updatedAt);
    }

    public updateInstance(groupName?: string, groupLink?: string, isActive?: boolean, groupChatId?: string, description?: string): TelegramGroupEntity {
        if (groupName !== undefined) this.groupName = groupName;
        if (groupLink !== undefined) this.groupLink = groupLink;
        if (isActive !== undefined) this.isActive = isActive;
        if (groupChatId !== undefined) this.groupChatId = groupChatId;
        if (description !== undefined) this.description = description;

        this.updatedAt = new Date();
        return this;
    }
}
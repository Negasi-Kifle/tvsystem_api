import { Prisma, TelegramGroupMember, TelegramGroup } from "@prisma/client";
import { TelegramGroupMember as DomainTelegramGroupMember, UserSummary } from "../../../../domain/entities/telegram-group-member.entity";
import { TelegramGroup as DomainTelegramGroup } from "../../../../domain/entities/telegram-groups.entity";
import { TelegramGroupMembersRepositoryInterface } from "../../../../domain/interfaces/repositories/telegram-group-members.interface";
import { PrismaBaseRepository } from "./base.repository";
import { SexTypes } from "../../../../domain/enums/sex-types.enum";
import { AddUserToTelegramGroupDto } from "../../../../presentation/dtos/requests/add-user-to-tg-group.dto";
import { RemoveUserFromTelegramGroupDto } from "../../../../presentation/dtos/requests/remove-user-from-tg-group.dto";

/**
 * Selected user fields for population (excludes sensitive data like passwordHash)
 */
type SelectedUser = {
    id: string;
    email: string;
    fullName: string;
    sex: string;
    phoneNumber: string;
    isActive: boolean;
};

type TelegramGroupMemberWithRelations = TelegramGroupMember & {
    user: SelectedUser;
    telegramGroup: TelegramGroup;
};

export interface TelegramGroupMemberFilter {
    userId?: string;
    telegramGroupId?: string;
}

export interface TelegramGroupMemberQueryOptions {
    skip: number;
    take: number;
    filters?: TelegramGroupMemberFilter;
}

export class TelegramGroupMemberRepository extends PrismaBaseRepository implements TelegramGroupMembersRepositoryInterface {

    /**
     * Map selected Prisma User fields to UserSummary
     */
    private toDomainUser(user: SelectedUser): UserSummary {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            sex: user.sex as SexTypes,
            phoneNumber: user.phoneNumber,
            isActive: user.isActive,
        };
    }

    /**
     * Map Prisma TelegramGroup to Domain TelegramGroup
     */
    private toDomainTelegramGroup(telegramGroup: TelegramGroup): DomainTelegramGroup {
        return {
            id: telegramGroup.id,
            groupName: telegramGroup.groupName,
            groupChatId: telegramGroup.groupChatId ?? '',
            groupLink: telegramGroup.groupLink,
            description: telegramGroup.description ?? '',
            isActive: telegramGroup.isActive,
            createdAt: telegramGroup.createdAt,
            updatedAt: telegramGroup.updatedAt,
        };
    }

    /**
     * Map Prisma TelegramGroupMember to Domain TelegramGroupMember
     * @param telegramGroupMember - Prisma telegram group member
     * @returns Domain telegram group member
     */
    public toDomain(
        telegramGroupMember: TelegramGroupMember | TelegramGroupMemberWithRelations
    ): DomainTelegramGroupMember {
        const result: DomainTelegramGroupMember = {
            id: telegramGroupMember.id,
            telegramGroupId: telegramGroupMember.telegramGroupId,
            userId: telegramGroupMember.userId,
            createdAt: telegramGroupMember.createdAt,
            updatedAt: telegramGroupMember.updatedAt,
        };

        // Include relations if they exist
        if ('user' in telegramGroupMember && telegramGroupMember.user) {
            result.user = this.toDomainUser(telegramGroupMember.user);
        }

        if ('telegramGroup' in telegramGroupMember && telegramGroupMember.telegramGroup) {
            result.telegramGroup = this.toDomainTelegramGroup(telegramGroupMember.telegramGroup);
        }

        return result;
    }


    private buildWhereClause(filters?: TelegramGroupMemberFilter): Prisma.TelegramGroupMemberWhereInput {
        if (!filters) return {};

        return {
            ...(filters.userId && { userId: filters.userId }),
            ...(filters.telegramGroupId && { telegramGroupId: filters.telegramGroupId }),
        };
    }

    async addToTelegramGroup(userId: string, telegramGroupId: string): Promise<DomainTelegramGroupMember> {
        return await this.prisma.telegramGroupMember.create({ data: { userId, telegramGroupId } });
    }

    async deleteTelegramGroupMember(id: string): Promise<DomainTelegramGroupMember | null> {
        const deletedTelegramGroupMember = await this.prisma.telegramGroupMember.delete({ where: { id } });
        return deletedTelegramGroupMember ? this.toDomain(deletedTelegramGroupMember) : null;
    }

    async findMany(query: TelegramGroupMemberQueryOptions): Promise<DomainTelegramGroupMember[]> {
        const where = this.buildWhereClause(query.filters);
        const telegramGroupMembers = await this.prisma.telegramGroupMember.findMany({
            where,
            skip: query.skip,
            take: query.take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        sex: true,
                        phoneNumber: true,
                        isActive: true,
                    },
                },
                telegramGroup: true,
            },
        });
        return telegramGroupMembers.map((member) => this.toDomain(member));
    }

    async findById(id: string): Promise<DomainTelegramGroupMember | null> {
        const telegramGroupMember = await this.prisma.telegramGroupMember.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        sex: true,
                        phoneNumber: true,
                        isActive: true,
                    },
                },
                telegramGroup: true,
            },
        });
        return telegramGroupMember ? this.toDomain(telegramGroupMember) : null;
    }

    async count(filters?: TelegramGroupMemberFilter): Promise<number> {
        const where = this.buildWhereClause(filters);
        return await this.prisma.telegramGroupMember.count({ where });
    }
}
import { Prisma, TelegramGroupMember } from '../generated/client';
import { TelegramGroupMemberEntity } from "../../../domain/entities/telegram-group-member.entity";
import { modelToEntity as mapTelegramGroupToEntity } from "./telegram-group";
import { SexTypes } from "../../../domain/enums/sex-types.enum";

type TelegramGroupMemberWithRelations = Prisma.TelegramGroupMemberGetPayload<{
    include: { telegramGroup: true; user: true };
}>;

type TelegramGroupMemberLike = Prisma.TelegramGroupMemberGetPayload<{}> | TelegramGroupMemberWithRelations;

export function modelToEntity(telegramGroupMember: TelegramGroupMemberLike): TelegramGroupMemberEntity {
    return TelegramGroupMemberEntity.createInstance(
        telegramGroupMember.telegramGroupId,
        telegramGroupMember.userId,
        telegramGroupMember.createdAt ?? new Date(),
        telegramGroupMember.updatedAt ?? new Date(),
        telegramGroupMember.id ?? '',
        'telegramGroup' in telegramGroupMember && telegramGroupMember.telegramGroup
            ? mapTelegramGroupToEntity(telegramGroupMember.telegramGroup)
            : undefined,
        'user' in telegramGroupMember && telegramGroupMember.user
            ? {
                id: telegramGroupMember.user.id,
                email: telegramGroupMember.user.email,
                fullName: telegramGroupMember.user.fullName,
                sex: telegramGroupMember.user.sex as SexTypes,
                phoneNumber: telegramGroupMember.user.phoneNumber,
                isActive: telegramGroupMember.user.isActive,
            }
            : undefined,
    )
}


export function entityToModel(telegramGroupMember: TelegramGroupMemberEntity): TelegramGroupMember {
    return {
        id: telegramGroupMember.id ?? '',
        telegramGroupId: telegramGroupMember.telegramGroupId,
        userId: telegramGroupMember.userId,
        createdAt: telegramGroupMember.createdAt ?? new Date(),
        updatedAt: telegramGroupMember.updatedAt ?? new Date(),
    };
}
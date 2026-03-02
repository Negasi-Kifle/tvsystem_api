import { User } from "@prisma/client";
import { SexTypes } from "../../../domain/enums/sex-types.enum";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { UserRefModel } from "../../../domain/enums/user-ref-model.enum";

export function modelToEntity(user: User): UserEntity {
    return UserEntity.createInstance(
        user.fullName,
        user.email,
        user.passwordHash,
        user.phoneNumber,
        user.sex as SexTypes,
        user.roles as UserRole[],
        user.isActive,
        user.isFirstTimeAccount,
        user.refModel as UserRefModel,
        user.telegramUsername ?? undefined,
        user.partnerId ?? undefined,
        user.employeeId ?? undefined,
        user.createdAt,
        user.updatedAt,
        user.id,
    );
}

export function entityToModel(user: UserEntity): User {
    return {
        id: user.id ?? '',
        fullName: user.fullName,
        email: user.email,
        passwordHash: user.passwordHash,
        phoneNumber: user.phoneNumber,
        sex: user.sex as SexTypes,
        roles: user.roles as UserRole[],
        isActive: user.isActive,
        isFirstTimeAccount: user.isFirstTimeAccount,
        refModel: user.refModel,
        telegramUsername: user.telegramUsername ?? null,
        partnerId: user.partnerId ?? null,
        employeeId: user.employeeId ?? null,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
    };
}
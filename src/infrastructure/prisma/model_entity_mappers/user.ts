import { User } from "@prisma/client";
import { SexTypes } from "../../../domain/enums/sex-types.enum";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";

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
        user.telegramUsername ?? '',
        user.createdAt,
        user.updatedAt,
        user.id,
    )
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
        telegramUsername: user.telegramUsername ?? null,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
    };
}
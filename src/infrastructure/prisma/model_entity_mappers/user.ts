import { Employee, Partner, User, SalesCommissionType as PrismaSalesCommissionType } from '../generated/client';
import { SexTypes } from "../../../domain/enums/sex-types.enum";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { UserRefModel } from "../../../domain/enums/user-ref-model.enum";
import { SalesCommissionType } from "../../../domain/enums/sales-commission-type.enum";
import { modelToEntity as employeeModelToEntity } from "./employee";
import { modelToEntity as partnerModelToEntity } from "./partner";

function domainToPrismaCommissionType(
    v: SalesCommissionType | undefined | null,
): PrismaSalesCommissionType | null {
    if (v == null) return null;
    return v === SalesCommissionType.Percentage
        ? PrismaSalesCommissionType.Percentage
        : PrismaSalesCommissionType.Fixed;
}

function prismaToDomainCommissionType(
    v: PrismaSalesCommissionType | null | undefined,
): SalesCommissionType | undefined {
    if (v == null) return undefined;
    return v === PrismaSalesCommissionType.Percentage
        ? SalesCommissionType.Percentage
        : SalesCommissionType.Fixed;
}

/** Prisma User with optional included relations (use include: { employee: true, partner: true } in query) */
export type UserWithRelations = User & {
    employee?: Employee | null;
    partner?: Partner | null;
};

export function modelToEntity(user: UserWithRelations): UserEntity {
    return new UserEntity(
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
        prismaToDomainCommissionType(user.salesCommissionType),
        user.salesCommissionAmount ?? undefined,
        user.createdAt,
        user.updatedAt,
        user.id,
        user.employee ? employeeModelToEntity(user.employee) : undefined,
        user.partner ? partnerModelToEntity(user.partner) : undefined,
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
        salesCommissionType: domainToPrismaCommissionType(user.salesCommissionType ?? null),
        salesCommissionAmount: user.salesCommissionAmount ?? null,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
    };
}

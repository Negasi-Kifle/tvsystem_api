import { UserFilters } from "../../../domain/interfaces/user-filters.interface";
import { Prisma } from "../generated/client";

export function buildWhereClauseForUser(filters: UserFilters): Prisma.UserWhereInput {
    if (!filters) return {};

    return {
        ...(filters.id !== undefined &&
            (Array.isArray(filters.id)
                ? { id: { in: filters.id } }
                : { id: filters.id })),
        ...(filters.email && { email: { contains: filters.email, mode: 'insensitive' as Prisma.QueryMode } }),
        ...(filters.phoneNumber && { phoneNumber: { contains: filters.phoneNumber } }),
        ...(filters.roles && filters.roles.length > 0 && { roles: { hasSome: filters.roles as string[] } }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters.sex && { sex: filters.sex }),
        ...(filters.isFirstTimeAccount !== undefined && { isFirstTimeAccount: filters.isFirstTimeAccount }),
        ...(filters.telegramUsername !== undefined && { telegramUsername: filters.telegramUsername }),
        ...(filters.refModel !== undefined && { refModel: filters.refModel }),
        ...(filters.partnerId !== undefined && { partnerId: filters.partnerId }),
        ...(filters.employeeId !== undefined && { employeeId: filters.employeeId }),
        ...(filters.salesCommissionType !== undefined && { salesCommissionType: filters.salesCommissionType }),
        ...(filters.salesCommissionAmount !== undefined && { salesCommissionAmount: filters.salesCommissionAmount }),
    };
}
import { Partner as PrismaPartner } from "@prisma/client";
import { Partner } from "../../../domain/entities/partner.entity";
import { Percentage } from "../../../domain/value-objects/percentage.value-object";

export function modelToEntity(partner: PrismaPartner): Partner {
    const revenueShare = partner.revenueShare as { value?: number };
    return {
        id: partner.id,
        name: partner.name,
        revenueShare: new Percentage(revenueShare?.value ?? 0),
        isActive: partner.isActive,
        createdAt: partner.createdAt,
        updatedAt: partner.updatedAt,
    };
}

export function entityToModel(partner: Partner): PrismaPartner {
    return {
        id: partner.id,
        name: partner.name,
        revenueShare: { value: partner.revenueShare.value },
        isActive: partner.isActive,
        createdAt: partner.createdAt ?? new Date(),
        updatedAt: partner.updatedAt ?? new Date(),
    };
}

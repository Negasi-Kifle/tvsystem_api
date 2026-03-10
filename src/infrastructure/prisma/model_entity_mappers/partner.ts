import { Partner, User } from '../generated/client';
import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { Percentage } from "../../../domain/value-objects/percentage.value-object";
import { modelToEntity as userModelToEntity } from "./user";

export function modelToEntity(partner: Partner & { user?: User | null }): PartnerEntity {
    const revenueShare = partner.revenueShare as { value?: number };

    const entity: PartnerEntity = PartnerEntity.createInstance(
        new Percentage(revenueShare?.value ?? 0),
        partner.isActive,
        partner.createdAt,
        partner.updatedAt,
        partner.id,
    );

    if (partner.user) {
        entity.user = userModelToEntity(partner.user as User);
    }

    return entity;
}

export function entityToModel(partner: PartnerEntity): Partner {
    return {
        id: partner.id ?? '',
        revenueShare: { value: partner.revenueShare.value },
        isActive: partner.isActive,
        createdAt: partner.createdAt ?? new Date(),
        updatedAt: partner.updatedAt ?? new Date(),
    };
}

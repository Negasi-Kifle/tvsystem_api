import { Partner, User } from '../generated/client';
import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { modelToEntity as userModelToEntity } from "./user";

export function modelToEntity(partner: Partner & { user?: User | null }): PartnerEntity {
    const entity: PartnerEntity = PartnerEntity.createInstance(
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
        isActive: partner.isActive,
        createdAt: partner.createdAt ?? new Date(),
        updatedAt: partner.updatedAt ?? new Date(),
    };
}

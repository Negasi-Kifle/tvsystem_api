import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";
import { Percentage } from "../../../domain/value-objects/percentage.value-object";

export type UpdatePartnerInput = {
    revenueShare?: number;
}

export class UpdatePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) { }

    async execute(id: string, payload: UpdatePartnerInput): Promise<PartnerEntity | null> {
        const partner = await this.partnerRepository.findById(id);
        if (!partner) {
            throw new EntityNotFoundError('Partner not found', 'Partner', id);
        }

        const updatedPartner = partner.updateInstance(
            payload.revenueShare !== undefined
                ? new Percentage(payload.revenueShare)
                : partner.revenueShare,
        );

        return this.partnerRepository.update(updatedPartner);
    }
}

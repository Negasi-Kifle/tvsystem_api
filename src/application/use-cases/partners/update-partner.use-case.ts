import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";

export type UpdatePartnerInput = {
    isActive: boolean;
}

export class UpdatePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) { }

    async execute(id: string, payload: UpdatePartnerInput): Promise<PartnerEntity | null> {
        const partner = await this.partnerRepository.findById(id);
        if (!partner) {
            throw new EntityNotFoundError('Partner not found', 'Partner', id);
        }

        const updatedPartner = partner.updateInstance(payload.isActive);
        return this.partnerRepository.update(updatedPartner);
    }
}

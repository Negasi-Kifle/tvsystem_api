import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";

export class GetPartnerByIdUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) { }

    async execute(id: string): Promise<PartnerEntity | null> {
        const partner = await this.partnerRepository.findById(id);
        if (!partner) {
            throw new EntityNotFoundError('Partner not found', 'Partner', id);
        }
        return partner;
    }
}

import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";

export class FetchAllPartnersUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) { }

    async execute(query: QueryOptions<PartnerEntity>): Promise<PartnerEntity[]> {
        return this.partnerRepository.findMany(query);
    }
}

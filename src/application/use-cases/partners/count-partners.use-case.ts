import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";

export class CountPartnersUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) { }

    async execute(query: QueryOptions<PartnerEntity>): Promise<number> {
        return this.partnerRepository.count(query.filters ?? {});
    }
}

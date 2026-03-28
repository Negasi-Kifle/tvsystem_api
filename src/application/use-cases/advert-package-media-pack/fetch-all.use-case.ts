import { AdvertPackageMediaPackEntity } from "../../../domain/entities/advert-package-media-pack.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { IAdvertPackageMediaPackRepository } from "../../../domain/repositories/advert-package-media-pack.repository.interface";


export class FetchAllAdvertPackageMediaPacksUseCase {
    constructor(
        private readonly advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository,
    ) { }

    async execute(query: QueryOptions<AdvertPackageMediaPackEntity>): Promise<AdvertPackageMediaPackEntity[]> {
        return this.advertPackageMediaPackRepository.findMany(query);
    }
}
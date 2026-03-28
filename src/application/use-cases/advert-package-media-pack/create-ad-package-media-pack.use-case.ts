import { AdvertPackageMediaPackEntity } from "../../../domain/entities/advert-package-media-pack.entity";
import { IAdvertPackageRepository } from "../../../domain/repositories/advert-package.repository.interface";
import { IAdvertPackageMediaPackRepository } from "../../../domain/repositories/advert-package-media-pack.repository.interface";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";
import { EntityNotFoundError } from "../../../domain/errors";
import { AdvertPackageFilters } from "../../../domain/interfaces/advert-package-filters.interface";


export type CreateAdvertPackageMediaPackInput = {
    advertPackageIds: string[];
    mediaPackId: string;
}

export class CreateAdvertPackageMediaPackUseCase {
    constructor(
        private readonly advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository,
        private readonly advertPackageRepository: IAdvertPackageRepository,
        private readonly mediaPackRepository: IMediaPackRepository,
    ) { }

    async execute(payload: CreateAdvertPackageMediaPackInput): Promise<AdvertPackageMediaPackEntity[]> {
        const mediaPack = await this.mediaPackRepository.findById(payload.mediaPackId);
        if (!mediaPack) {
            throw new EntityNotFoundError('Media pack not found', 'MediaPack', payload.mediaPackId);
        }
        const advertPackages = await this.advertPackageRepository.findMany({
            filters: {
                id: payload.advertPackageIds,
            } as AdvertPackageFilters,
        });
        
        if (advertPackages.length !== payload.advertPackageIds.length) {
            throw new EntityNotFoundError('One or more advert packages not found', 'AdvertPackage', payload.advertPackageIds.join(','));
        }

        // Create advert-package-media-pack instances
        const advertPackageMediaPacks = advertPackages.map((advertPackage) =>
            AdvertPackageMediaPackEntity.createInstance(advertPackage.id!, payload.mediaPackId),
        );


        return this.advertPackageMediaPackRepository.createMany(advertPackageMediaPacks);
    }
}
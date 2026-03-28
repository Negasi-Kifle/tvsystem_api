import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { AdvertPackageEntity } from "../../../domain/entities/advert-package.entity";
import { IAdvertPackageMediaPackRepository } from "../../../domain/repositories/advert-package-media-pack.repository.interface";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";
import { EntityAlreadyExistsError } from "../../../domain/errors";
import { AdvertPackageFilters } from "../../../domain/interfaces/advert-package-filters.interface";
import { IAdvertPackageRepository } from "../../../domain/repositories/advert-package.repository.interface";
import { AdvertPackageMediaPackEntity } from "../../../domain/entities/advert-package-media-pack.entity";


export type CreateMediaPackWithAdPackagesInput = {
    version: string;
    versionSlug?: string;
    description?: string;
    isActive?: boolean;
    advertPackageIds: string[];
}

export class CreateMediaPackWithAdPackagesUseCase {
    constructor(
        private readonly mediaPackRepository: IMediaPackRepository,
        private readonly advertPackageRepository: IAdvertPackageRepository,
        private readonly advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository,
    ) { }

    async execute(payload: CreateMediaPackWithAdPackagesInput): Promise<MediaPackEntity |null> {
        let version: MediaPackEntity | undefined = undefined;
        const createdAdPackageMediaPackIds: string[] = [];
        try {

            const versionSlug = payload.versionSlug ?? payload.version.toLowerCase().replace(/ /g, '-');
            const duplicate = await this.mediaPackRepository.findByVersionSlug(versionSlug);
            if (duplicate) {
                throw new EntityAlreadyExistsError("Media pack with this version already exists", "MediaPack", versionSlug);
            }

            const mediaPack = MediaPackEntity.createInstance(payload.version, versionSlug, payload.description, payload.isActive);
            version = await this.mediaPackRepository.create(mediaPack);

            // Check adver-packages exists
            const advertPackages = await this.advertPackageRepository.findMany({
                filters: {
                    id: payload.advertPackageIds,
                } as AdvertPackageFilters,
            });

            // Prepare the advert-package-media-pack instances
            const advertPackageMediaPacks = advertPackages.map((advertPackage) =>
                AdvertPackageMediaPackEntity.createInstance(advertPackage.id!, version!.id!),
            );

            console.log("AdPackMedPacks: ", advertPackageMediaPacks)
            // Create the advert-package-media-pack instances
            const createdAdvertPackageMediaPacks = await this.advertPackageMediaPackRepository.createMany(advertPackageMediaPacks);

            createdAdPackageMediaPackIds.push(...createdAdvertPackageMediaPacks.map((p) => p.id!));

            return version!;
        } catch (error) {
            for (const id of createdAdPackageMediaPackIds) {
                await this.advertPackageMediaPackRepository.deleteById(id);
            }
            if (version?.id) {
                await this.mediaPackRepository.deleteById(version.id);
            }
            throw error;
        }
    }
}
 
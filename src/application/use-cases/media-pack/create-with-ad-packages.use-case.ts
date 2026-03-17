import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { AdvertPackageEntity } from "../../../domain/entities/advert-package.entity";
import { IAdvertPackageRepository } from "../../../domain/repositories/advert-package.repository.interface";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";
import { CreateAdvertPackageInput } from "../advert-package/create-advert-package.use-case";
import { EntityAlreadyExistsError } from "../../../domain/errors";


export type CreateMediaPackWithAdPackagesInput = {
    version: string;
    versionSlug?: string;
    description?: string;
    isActive?: boolean;
    advertPackages: Omit<CreateAdvertPackageInput, 'mediaPackId' | 'finalPrice'>[];
}

export class CreateMediaPackWithAdPackagesUseCase {
    constructor(
        private readonly mediaPackRepository: IMediaPackRepository,
        private readonly advertPackageRepository: IAdvertPackageRepository,
    ) { }

    async execute(payload: CreateMediaPackWithAdPackagesInput): Promise<{ mediaPack: MediaPackEntity; advertPackages: AdvertPackageEntity[] }> {
        let version: MediaPackEntity | undefined = undefined;
        try { 

            const versionSlug = payload.versionSlug ?? payload.version.toLowerCase().replace(/ /g, '-');
            const duplicate = await this.mediaPackRepository.findByVersionSlug(versionSlug);
            if (duplicate) {
                throw new EntityAlreadyExistsError("Media pack with this version already exists", "MediaPack", versionSlug);
            }
            
            const mediaPack = MediaPackEntity.createInstance(payload.version, versionSlug, payload.description, payload.isActive);
            version = await this.mediaPackRepository.create(mediaPack);

            // TODO: Configure VAT_RATE and OTHER_TAXES_RATE in environment as numeric percentages (e.g. "5" for 5%)
            const otherTaxesRate = Number(process.env.OTHER_TAXES_RATE ?? '0') || 0;
            const vatRate = Number(process.env.VAT_RATE ?? '0') || 0;

            // Prepare the ad-packages instance (compute finalPrice from price/taxes + env rates)
            const advertPackages = payload.advertPackages.map(advertPackage => {
                const otherTaxes = (advertPackage.otherTaxes ?? 0) + otherTaxesRate;
                const allTaxes = otherTaxes + vatRate;
                const finalPrice = Math.ceil(advertPackage.priceBeforeVAT * (1 + allTaxes / 100));
                return AdvertPackageEntity.createInstance(
                    advertPackage.name,
                    advertPackage.nameSlug ?? advertPackage.name.toLowerCase().replace(/ /g, '-'),
                    version!.id!,
                    advertPackage.showIds,
                    advertPackage.advertisementsCount,
                    advertPackage.announcementsCount,
                    advertPackage.popUpsCount,
                    advertPackage.bonusesCount,
                    advertPackage.priceBeforeVAT,
                    otherTaxes,
                    finalPrice,
                    advertPackage.isActive,
                    advertPackage.advertisementsRerunCount,
                    advertPackage.announcementsRerunCount,
                    advertPackage.popUpsRerunCount,
                    advertPackage.bonusesRerunCount,
                    advertPackage.description,
                );
            });
    
            // Create the ad-packages
            const createdAdvertPackages = await this.advertPackageRepository.createMany(advertPackages);
    
            
            return { mediaPack: version, advertPackages: createdAdvertPackages };
        } catch (error) {
            // If media pack was created, delete it. This will cascade delete the ad-packages.
            if (version) await this.mediaPackRepository.deleteById(version.id!);
            throw error;
        }
    }
}
import { MediaPackEntity } from "../entities/media-pack.entity";
import { AdvertPackageEntity } from "../entities/advert-package.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IAdvertPackageRepository extends IBaseRepository<AdvertPackageEntity> {
    createAdvertPackageWithVersion(
        advertPackage: Omit<AdvertPackageEntity, 'id'>,
        version: Omit<MediaPackEntity, 'id'>,
    ): Promise<{ advertPackage: AdvertPackageEntity; version: MediaPackEntity }>;
    createMany(advertPackages: Omit<AdvertPackageEntity, 'id'>[]): Promise<AdvertPackageEntity[]>;
}

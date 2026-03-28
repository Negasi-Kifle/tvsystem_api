import { MediaPackEntity } from "../entities/media-pack.entity";
import { AdvertPackageEntity } from "../entities/advert-package.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IAdvertPackageRepository extends Omit<IBaseRepository<AdvertPackageEntity>, 'create'> {
    create(data: Omit<AdvertPackageEntity, 'id'>, linkMediaPackId?: string): Promise<AdvertPackageEntity>;
    createAdvertPackageWithVersion(
        advertPackage: Omit<AdvertPackageEntity, 'id'>,
        version: Omit<MediaPackEntity, 'id'>,
    ): Promise<{ advertPackage: AdvertPackageEntity; version: MediaPackEntity }>;
    createMany(
        advertPackages: Omit<AdvertPackageEntity, 'id'>[],
        linkAllToMediaPackId?: string,
    ): Promise<AdvertPackageEntity[]>;
}

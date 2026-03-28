import { AdvertPackageMediaPackEntity } from "../entities/advert-package-media-pack.entity";
import { IBaseRepository } from "./base.repository.interface";


export interface IAdvertPackageMediaPackRepository extends IBaseRepository<AdvertPackageMediaPackEntity> {
    createMany(advertPackageMediaPacks: Omit<AdvertPackageMediaPackEntity, 'id'>[]): Promise<AdvertPackageMediaPackEntity[]>;
}
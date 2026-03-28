import { AdvertPackageEntity } from './advert-package.entity';
import { MediaPackEntity } from './media-pack.entity';

export class AdvertPackageMediaPackEntity {
    constructor(
        public advertPackageId: string,
        public mediaPackId: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public advertPackage?: AdvertPackageEntity,
        public mediaPack?: MediaPackEntity,
    ) { }

    public static createInstance(
        advertPackageId: string,
        mediaPackId: string,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
        advertPackage?: AdvertPackageEntity,
        mediaPack?: MediaPackEntity,
    ): AdvertPackageMediaPackEntity {
        return new AdvertPackageMediaPackEntity(
            advertPackageId,
            mediaPackId,
            createdAt,
            updatedAt,
            id,
            advertPackage,
            mediaPack,
        );
    }

    public updateInstance(
        advertPackageId?: string,
        mediaPackId?: string,
    ): AdvertPackageMediaPackEntity {
        if (advertPackageId !== undefined) this.advertPackageId = advertPackageId;
        if (mediaPackId !== undefined) this.mediaPackId = mediaPackId;

        return this;
    }
}
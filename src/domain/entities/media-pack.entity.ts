import { AdvertPackageEntity } from "./advert-package.entity";

export class MediaPackEntity {
    constructor(
        public version: string,
        public versionSlug: string,
        public description?: string,
        public isActive: boolean = true,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public advertPackages?: AdvertPackageEntity[],
    ) { }

    public static createInstance(
        version: string,
        versionSlug: string,
        description?: string,
        isActive: boolean = true,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
        advertPackages?: AdvertPackageEntity[],
    ): MediaPackEntity {
        return new MediaPackEntity(
            version,
            versionSlug,
            description,
            isActive,
            createdAt,
            updatedAt,
            id,
            advertPackages,
        )
    }

    public updateInstance(version?: string, versionSlug?: string, description?: string, isActive?: boolean): MediaPackEntity {
        if (version !== undefined) this.version = version;
        if (versionSlug !== undefined) this.versionSlug = versionSlug;
        if (description !== undefined) this.description = description;
        if (isActive !== undefined) this.isActive = isActive;

        this.updatedAt = new Date();
        return this;
    }
}
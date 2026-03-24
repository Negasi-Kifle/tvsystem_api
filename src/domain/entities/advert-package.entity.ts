import { MediaPackSummary } from '../interfaces/media-pack-summary.interface';
import { ShowSummary } from '../interfaces/show-summary.interface';

export class AdvertPackageEntity {
    constructor(
        public name: string,
        public nameSlug: string,
        public mediaPackId: string,
        public showIds: string[],
        public advertisementsCount: number,
        public announcementsCount: number,
        public popUpsCount: number,
        public bonusesCount: number,
        public priceBeforeVAT: number,
        public otherTaxes: number,
        public finalPrice: number,
        public isActive: boolean = true,
        public advertisementsRerunCount: number = 0,
        public announcementsRerunCount: number = 0,
        public popUpsRerunCount: number = 0,
        public bonusesRerunCount: number = 0,
        public description?: string,
        public imageUrl: string | null = null,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public mediaPack?: MediaPackSummary,
        public shows?: ShowSummary[],
    ) { }

    public static createInstance(
        name: string,
        nameSlug: string,
        mediaPackId: string,
        showIds: string[],
        advertisementsCount: number,
        announcementsCount: number,
        popUpsCount: number,
        bonusesCount: number,
        priceBeforeVAT: number,
        otherTaxes: number,
        finalPrice: number,
        isActive: boolean = true,
        advertisementsRerunCount: number = 0,
        announcementsRerunCount: number = 0,
        popUpsRerunCount: number = 0,
        bonusesRerunCount: number = 0,
        description?: string,
        imageUrl?: string | null,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
        mediaPack?: MediaPackSummary,
        shows?: ShowSummary[],
    ): AdvertPackageEntity {
        return new AdvertPackageEntity(
            name,
            nameSlug,
            mediaPackId,
            showIds,
            advertisementsCount,
            announcementsCount,
            popUpsCount,
            bonusesCount,
            priceBeforeVAT,
            otherTaxes,
            finalPrice,
            isActive,
            advertisementsRerunCount,
            announcementsRerunCount,
            popUpsRerunCount,
            bonusesRerunCount,
            description,
            imageUrl ?? null,
            createdAt,
            updatedAt,
            id,
            mediaPack,
            shows,
        );
    }

    public updateInstance(
        name?: string,
        nameSlug?: string,
        mediaPackId?: string,
        showIds?: string[],
        advertisementsCount?: number,
        announcementsCount?: number,
        popUpsCount?: number,
        bonusesCount?: number,
        priceBeforeVAT?: number,
        otherTaxes?: number,
        finalPrice?: number,
        isActive?: boolean,
        advertisementsRerunCount?: number,
        announcementsRerunCount?: number,
        popUpsRerunCount?: number,
        bonusesRerunCount?: number,
        description?: string,
        imageUrl?: string | null,
    ): AdvertPackageEntity {
        if (name !== undefined) this.name = name;
        if (nameSlug !== undefined) this.nameSlug = nameSlug;
        if (mediaPackId !== undefined) this.mediaPackId = mediaPackId;
        if (showIds !== undefined) this.showIds = showIds;
        if (advertisementsCount !== undefined) this.advertisementsCount = advertisementsCount;
        if (announcementsCount !== undefined) this.announcementsCount = announcementsCount;
        if (popUpsCount !== undefined) this.popUpsCount = popUpsCount;
        if (bonusesCount !== undefined) this.bonusesCount = bonusesCount;
        if (priceBeforeVAT !== undefined) this.priceBeforeVAT = priceBeforeVAT;
        if (otherTaxes !== undefined) this.otherTaxes = otherTaxes;
        if (finalPrice !== undefined) this.finalPrice = finalPrice;
        if (isActive !== undefined) this.isActive = isActive;
        if (advertisementsRerunCount !== undefined) this.advertisementsRerunCount = advertisementsRerunCount;
        if (announcementsRerunCount !== undefined) this.announcementsRerunCount = announcementsRerunCount;
        if (popUpsRerunCount !== undefined) this.popUpsRerunCount = popUpsRerunCount;
        if (bonusesRerunCount !== undefined) this.bonusesRerunCount = bonusesRerunCount;
        if (description !== undefined) this.description = description;
        if (imageUrl !== undefined) this.imageUrl = imageUrl;

        this.updatedAt = new Date();
        return this;
    }
}

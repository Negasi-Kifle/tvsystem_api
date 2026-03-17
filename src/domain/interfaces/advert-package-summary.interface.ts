

export interface AdvertPackageSummary {
    id: string;
    name: string;
    nameSlug: string;
    mediaPackId: string;
    showIds: string[];
    advertisementsCount: number;
    announcementsCount: number;
    popUpsCount: number;
    bonusesCount: number;
    priceBeforeVAT: number;
    otherTaxes: number;
    finalPrice: number;
    isActive: boolean;
    advertisementsRerunCount: number;
    announcementsRerunCount: number;
    popUpsRerunCount: number;
    bonusesRerunCount: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
import { AdvertPackageEntity } from '../../../domain/entities/advert-package.entity';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../../domain/errors';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';

export type UpdateAdvertPackageInput = {
  name?: string;
  nameSlug?: string;
  showIds?: string[];
  advertisementsCount?: number;
  announcementsCount?: number;
  popUpsCount?: number;
  bonusesCount?: number;
  priceBeforeVAT?: number;
  otherTaxes?: number;
  finalPrice?: number;
  isActive?: boolean;
  advertisementsRerunCount?: number;
  announcementsRerunCount?: number;
  popUpsRerunCount?: number;
  bonusesRerunCount?: number;
  description?: string;
  imageUrl?: string;
};

export class UpdateAdvertPackageUseCase {
  constructor(private readonly advertPackageRepository: IAdvertPackageRepository) {}

  async execute(id: string, payload: UpdateAdvertPackageInput): Promise<AdvertPackageEntity | null> {
    const existing = await this.advertPackageRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', id);
    }

    const nameSlug = payload.nameSlug ?? existing.nameSlug;
    if (payload.nameSlug !== undefined) {
      const duplicates = await this.advertPackageRepository.findMany({
        filters: { nameSlug },
        take: 2,
      });
      const other = duplicates.filter((p) => p.id !== id);
      if (other.length > 0) {
        throw new EntityAlreadyExistsError(
          'Advert package with this name slug already exists',
          'AdvertPackage',
          nameSlug,
        );
      }
    }

    // TODO: Configure VAT_RATE and OTHER_TAXES_RATE in environment as numeric percentages (e.g. "5" for 5%)
    const shouldRecalculatePrices = payload.priceBeforeVAT !== undefined || payload.otherTaxes !== undefined;

    let recalculatedOtherTaxes: number | undefined;
    let recalculatedFinalPrice: number | undefined;

    if (shouldRecalculatePrices) {
      const otherTaxesRateEnv = process.env.OTHER_TAXES_RATE ?? '0';
      const otherTaxesRate = Number(otherTaxesRateEnv) || 0;
      const vatRateEnv = process.env.VAT_RATE ?? '0';
      const vatRate = Number(vatRateEnv) || 0;

      const effectivePriceBeforeVAT = payload.priceBeforeVAT ?? existing.priceBeforeVAT;

      // If caller provided a new base "otherTaxes", combine it with env rate; otherwise reuse existing combined value.
      const effectiveOtherTaxes =
        payload.otherTaxes !== undefined
          ? payload.otherTaxes + otherTaxesRate
          : existing.otherTaxes;

      const allTaxes = effectiveOtherTaxes + vatRate;
      recalculatedOtherTaxes = effectiveOtherTaxes;
      recalculatedFinalPrice = Math.ceil(effectivePriceBeforeVAT * (1 + allTaxes / 100));
    }

    const updated = existing.updateInstance(
      payload.name,
      payload.nameSlug,
      payload.showIds,
      payload.advertisementsCount,
      payload.announcementsCount,
      payload.popUpsCount,
      payload.bonusesCount,
      payload.priceBeforeVAT,
      recalculatedOtherTaxes,
      recalculatedFinalPrice,
      payload.isActive,
      payload.advertisementsRerunCount,
      payload.announcementsRerunCount,
      payload.popUpsRerunCount,
      payload.bonusesRerunCount,
      payload.description,
      payload.imageUrl,
    );
    return this.advertPackageRepository.update(updated);
  }
}

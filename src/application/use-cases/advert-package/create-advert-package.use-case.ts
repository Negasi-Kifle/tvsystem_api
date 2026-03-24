import { AdvertPackageEntity } from '../../../domain/entities/advert-package.entity';
import { EntityAlreadyExistsError, EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { IMediaPackRepository } from '../../../domain/repositories/media-pack.repository.interface';

export type CreateAdvertPackageInput = {
  name: string;
  nameSlug?: string;
  mediaPackId: string;
  showIds: string[];
  advertisementsCount: number;
  announcementsCount: number;
  popUpsCount: number;
  bonusesCount: number;
  priceBeforeVAT: number;
  otherTaxes: number;
  finalPrice: number;
  isActive?: boolean;
  advertisementsRerunCount?: number;
  announcementsRerunCount?: number;
  popUpsRerunCount?: number;
  bonusesRerunCount?: number;
  description?: string;
  /** Required when creating via POST /advert-packages (validated in execute). */
  imageUrl?: string;
};

export class CreateAdvertPackageUseCase {
  constructor(
    private readonly advertPackageRepository: IAdvertPackageRepository,
    private readonly mediaPackRepository: IMediaPackRepository,
  ) {}

  async execute(payload: CreateAdvertPackageInput): Promise<AdvertPackageEntity> {
    if (payload.imageUrl === undefined || payload.imageUrl.trim() === '') {
      throw new ValidationError('Advert package image is required');
    }

    const nameSlug = payload.nameSlug !== undefined ? payload.nameSlug : payload.name.toLowerCase().replace(/ /g, '-');
    const mediaPack = await this.mediaPackRepository.findById(payload.mediaPackId);
    if (!mediaPack) {
      throw new EntityNotFoundError('Media pack not found', 'MediaPack', payload.mediaPackId);
    }

    const existing = await this.advertPackageRepository.findMany({
      filters: { mediaPackId: payload.mediaPackId, nameSlug: nameSlug },
      skip: 0,
      take: 10,
    });
    if (existing.length > 0) {
      throw new EntityAlreadyExistsError(
        'Advert package with this name slug already exists for this media pack',
        'AdvertPackage',
        nameSlug,
      );
    }

    const entity = AdvertPackageEntity.createInstance(
      payload.name,
      nameSlug,
      payload.mediaPackId,
      payload.showIds,
      payload.advertisementsCount,
      payload.announcementsCount,
      payload.popUpsCount,
      payload.bonusesCount,
      payload.priceBeforeVAT,
      payload.otherTaxes,
      payload.finalPrice,
      payload.isActive ?? true,
      payload.advertisementsRerunCount ?? 0,
      payload.announcementsRerunCount ?? 0,
      payload.popUpsRerunCount ?? 0,
      payload.bonusesRerunCount ?? 0,
      payload.description,
      payload.imageUrl,
    );
    return this.advertPackageRepository.create(entity);
  }
}

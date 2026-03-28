import { AdvertPackageMediaPackEntity } from '../../../domain/entities/advert-package-media-pack.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertPackageMediaPackRepository } from '../../../domain/repositories/advert-package-media-pack.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { IMediaPackRepository } from '../../../domain/repositories/media-pack.repository.interface';

export type UpdateAdvertPackageMediaPackInput = {
  advertPackageId?: string;
  mediaPackId?: string;
};

export class UpdateAdvertPackageMediaPackUseCase {
  constructor(
    private readonly advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository,
    private readonly advertPackageRepository: IAdvertPackageRepository,
    private readonly mediaPackRepository: IMediaPackRepository,
  ) { }

  async execute(id: string, payload: UpdateAdvertPackageMediaPackInput): Promise<AdvertPackageMediaPackEntity | null> {
    const existing = await this.advertPackageMediaPackRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError(
        'Advert package media pack link not found',
        'AdvertPackageMediaPack',
        id,
      );
    }

    if (payload.advertPackageId !== undefined) {
      const advertPackage = await this.advertPackageRepository.findById(payload.advertPackageId);
      if (!advertPackage) {
        throw new EntityNotFoundError(
          'Advert package not found',
          'AdvertPackage',
          payload.advertPackageId,
        );
      }
    }

    if (payload.mediaPackId !== undefined) {
      const mediaPack = await this.mediaPackRepository.findById(payload.mediaPackId);
      if (!mediaPack) {
        throw new EntityNotFoundError('Media pack not found', 'MediaPack', payload.mediaPackId);
      }
    }

    const advertPackageId =
      payload.advertPackageId !== undefined ? payload.advertPackageId : existing.advertPackageId;
    const mediaPackId = payload.mediaPackId !== undefined ? payload.mediaPackId : existing.mediaPackId;

    const updatedEntity = existing.updateInstance(advertPackageId, mediaPackId);

    return await this.advertPackageMediaPackRepository.update(updatedEntity);
  }
}

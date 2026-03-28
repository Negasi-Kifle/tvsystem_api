import { AdvertPackageMediaPackEntity } from '../../../domain/entities/advert-package-media-pack.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertPackageMediaPackRepository } from '../../../domain/repositories/advert-package-media-pack.repository.interface';

export class DeleteAdvertPackageMediaPackUseCase {
  constructor(private readonly advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository) {}

  async execute(id: string): Promise<AdvertPackageMediaPackEntity | null> {
    const existing = await this.advertPackageMediaPackRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError(
        'Advert package media pack link not found',
        'AdvertPackageMediaPack',
        id,
      );
    }
    return await this.advertPackageMediaPackRepository.deleteById(id);
  }
}

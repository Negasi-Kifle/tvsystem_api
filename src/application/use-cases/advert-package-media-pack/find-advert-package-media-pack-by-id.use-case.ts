import { AdvertPackageMediaPackEntity } from '../../../domain/entities/advert-package-media-pack.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertPackageMediaPackRepository } from '../../../domain/repositories/advert-package-media-pack.repository.interface';

export class FindAdvertPackageMediaPackByIdUseCase {
  constructor(private readonly advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository) {}

  async execute(id: string): Promise<AdvertPackageMediaPackEntity> {
    const row = await this.advertPackageMediaPackRepository.findById(id);
    if (!row) {
      throw new EntityNotFoundError(
        'Advert package media pack link not found',
        'AdvertPackageMediaPack',
        id,
      );
    }
    return row;
  }
}

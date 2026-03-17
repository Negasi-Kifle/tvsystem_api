import { AdvertPackageEntity } from '../../../domain/entities/advert-package.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';

export class GetAdvertPackageByIdUseCase {
  constructor(private readonly advertPackageRepository: IAdvertPackageRepository) {}

  async execute(id: string): Promise<AdvertPackageEntity> {
    const pkg = await this.advertPackageRepository.findById(id);
    if (!pkg) {
      throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', id);
    }
    return pkg;
  }
}

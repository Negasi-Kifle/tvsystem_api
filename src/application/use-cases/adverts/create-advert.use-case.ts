import { AdvertRepository } from '../../../infrastructure/database/prisma/repositories/advert.repository';
import { Advert } from '../../../domain/entities/advert.entity';
import { AdvertStatus } from '../../../domain/enums/advert-status.enum';

export class CreateAdvertUseCase {
  constructor(private readonly advertRepo = new AdvertRepository()) {}

  async execute(payload: Omit<Advert, 'id' | 'status'>): Promise<Advert> {
    return this.advertRepo.create({ ...payload, status: AdvertStatus.Draft });
  }
}

import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { AdvertPlacementStatus } from '../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../domain/enums/advert-position.enum';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';

export type CreateAdvertPlacementInput = {
  advertSalesId: string;
  showId: string;
  date: Date;
  dateEth: string;
  position: AdvertPosition;
  durationSeconds: number;
  status?: AdvertPlacementStatus;
  broadcastSlotId?: string;
  spotIndex?: number;
  plannedTimeMinutes?: number;
};

export class CreateAdvertPlacementUseCase {
  constructor(
    private readonly placementRepo: IAdvertPlacementRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly showRepo: IShowRepository,
    private readonly broadcastSlotRepo: IBroadcastSlotRepository,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
    private readonly advertPackageRepo: IAdvertPackageRepository,
  ) {}

  async execute(input: CreateAdvertPlacementInput): Promise<AdvertPlacementEntity> {
    const sale = await this.advertSalesRepo.findById(input.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', input.advertSalesId);
    }

    // Check show id exists in the advert package
    const adPackage = await this.advertPackageRepo.findById(sale.adPackageId);
    if (!adPackage) {
      throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', sale.adPackageId);
    }
   
    if (!adPackage.showIds.includes(input.showId)) {
      throw new ValidationError('Show is not part of the advert package.');
    }

    const show = await this.showRepo.findById(input.showId);
    if (!show) {
      throw new EntityNotFoundError('Show not found', 'Show', input.showId);
    }

    if (input.broadcastSlotId) {
      const slot = await this.broadcastSlotRepo.findById(input.broadcastSlotId);
      if (!slot) {
        throw new EntityNotFoundError('Broadcast slot not found', 'BroadcastSlot', input.broadcastSlotId);
      }
    }

    const placementDate = new Date(input.date);
    if (placementDate < sale.adStartDate || placementDate > sale.adEndDate) {
      throw new ValidationError('Placement date must be within the advert sale date range');
    }

    // Generate broadcast code
    const broadcastCode = await this.generateBusinessRefService.generateBusinessRef();

    const entity = AdvertPlacementEntity.createInstance(
      input.advertSalesId,
      input.showId,
      input.date,
      input.dateEth,
      input.position,
      input.durationSeconds,
      input.status ?? AdvertPlacementStatus.Scheduled,
      input.broadcastSlotId,
      input.spotIndex ?? 1,
      broadcastCode,
      input.plannedTimeMinutes,
    );

    return this.placementRepo.create(entity);
  }
}

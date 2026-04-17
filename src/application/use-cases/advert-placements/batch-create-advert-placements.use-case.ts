import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { AdvertPlacementStatus } from '../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../domain/enums/advert-position.enum';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { ICalendarService } from '../../../domain/services/calendar.service';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';

export type BatchCreateAdvertPlacementsInput = {
  advertSalesId: string;
  position?: AdvertPosition;
  dateFrom?: Date;
  dateTo?: Date;
};

export class BatchCreateAdvertPlacementsUseCase {
  constructor(
    private readonly placementRepo: IAdvertPlacementRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPackageRepo: IAdvertPackageRepository,
    private readonly broadcastSlotRepo: IBroadcastSlotRepository,
    private readonly calendarService: ICalendarService,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
  ) {}

  async execute(input: BatchCreateAdvertPlacementsInput): Promise<AdvertPlacementEntity[]> {
    const sale = await this.advertSalesRepo.findById(input.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', input.advertSalesId);
    }

    const adPackage = await this.advertPackageRepo.findById(sale.adPackageId);
    if (!adPackage) {
      throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', sale.adPackageId);
    }

    const dateFrom = input.dateFrom ?? sale.adStartDate;
    const dateTo = input.dateTo ?? sale.adEndDate;
    const position = input.position ?? AdvertPosition.Middle;

    if (dateFrom < sale.adStartDate || dateTo > sale.adEndDate) {
      throw new ValidationError('Date range must be within the advert sale date range');
    }

    const showIds = adPackage.showIds;
    if (!showIds || showIds.length === 0) {
      throw new ValidationError('Advert package has no associated shows');
    }

    const createdPlacements: AdvertPlacementEntity[] = [];

    for (const showId of showIds) {
      const broadcastSlots = await this.broadcastSlotRepo.findMany({
        filters: { showId, dateFrom, dateTo } as any,
        take: 1000,
      });

      for (const slot of broadcastSlots) {
        if (!slot.id) continue;

        const dateEth = this.calendarService.formatEthiopianDate(slot.date);

        // Generate broadcast code
        const broadcastCode = await this.generateBusinessRefService.generateBusinessRef();

        const entity = AdvertPlacementEntity.createInstance(
          input.advertSalesId,
          showId,
          slot.date,
          dateEth,
          position,
          sale.adLengthSeconds,
          AdvertPlacementStatus.Scheduled,
          slot.id,
          1,
          broadcastCode,
          slot.startTimeMinutes,
        );

        const created = await this.placementRepo.create(entity);
        createdPlacements.push(created);
      }
    }

    return createdPlacements;
  }
}

import { EntityNotFoundError } from '../../../domain/errors';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';

export type ReportRow = {
  date: string;
  dateEth: string;
  showId: string;
  position: string;
  spotIndex: number;
  plannedTimeMinutes: number | null;
  actualAirTime: string | null;
  durationSeconds: number;
  broadcastCode: string | null;
  status: string;
};

export type AdvertReportData = {
  referenceNumber: string;
  customerName: string;
  campaignName: string;
  adStartDate: Date;
  adEndDate: Date;
  adLengthSeconds: number;
  totalSlots: number;
  airedCount: number;
  missedCount: number;
  scheduledCount: number;
  packageName: string;
  rows: ReportRow[];
};

export class GenerateAdvertReportUseCase {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly placementRepo: IAdvertPlacementRepository,
    private readonly advertPackageRepo: IAdvertPackageRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(advertSalesId: string): Promise<AdvertReportData> {
    const sale = await this.advertSalesRepo.findById(advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', advertSalesId);
    }

    const customer = await this.customerRepo.findById(sale.customerId);
    const adPackage = await this.advertPackageRepo.findById(sale.adPackageId);

    const placements = await this.placementRepo.findMany({
      filters: { advertSalesId },
      take: 10000,
    });

    let airedCount = 0;
    let missedCount = 0;
    let scheduledCount = 0;

    const rows: ReportRow[] = placements.map((p) => {
      if (p.status === 'AIRED') airedCount++;
      else if (p.status === 'MISSED') missedCount++;
      else if (p.status === 'SCHEDULED') scheduledCount++;

      return {
        date: (p.date ?? new Date(0)).toISOString().slice(0, 10),
        dateEth: p.dateEth,
        showId: p.showId,
        position: p.position,
        spotIndex: p.spotIndex,
        plannedTimeMinutes: p.plannedTimeMinutes ?? null,
        actualAirTime: p.actualAirTime?.toISOString() ?? null,
        durationSeconds: p.durationSeconds,
        broadcastCode: p.broadcastCode ?? null,
        status: p.status,
      };
    });

    return {
      referenceNumber: sale.referenceNumber,
      customerName: customer?.name ?? 'N/A',
      campaignName: sale.campaignName,
      adStartDate: sale.adStartDate,
      adEndDate: sale.adEndDate,
      adLengthSeconds: sale.adLengthSeconds,
      totalSlots: sale.numOfSlots,
      airedCount,
      missedCount,
      scheduledCount,
      packageName: adPackage?.name ?? 'N/A',
      rows,
    };
  }
}

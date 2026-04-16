import { AdvertPlacementStatus } from '../../../domain/enums/advert-placement-status.enum';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { ISatelliteLogEntryRepository } from '../../../domain/repositories/satellite-log-entry.repository.interface';
import { SatelliteLogMatchType } from '../../../domain/entities/satellite-log-entry.entity';
import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';

export type VerifyResult = {
  aired: number;
  missed: number;
  total: number;
};

export class VerifyAdvertDeliveryUseCase {
  constructor(
    private readonly placementRepo: IAdvertPlacementRepository,
    private readonly entryRepo: ISatelliteLogEntryRepository,
  ) {}

  async execute(uploadId: string): Promise<VerifyResult> {
    const entries = await this.entryRepo.findByUploadId(uploadId);

    const matchedPlacementIds = new Set<string>();
    for (const entry of entries) {
      if (
        entry.matchType !== SatelliteLogMatchType.Unmatched &&
        entry.matchedPlacementId
      ) {
        matchedPlacementIds.add(entry.matchedPlacementId);
      }
    }

    const dates = entries.map((e) => e.broadcastDateTime.toISOString().slice(0, 10));
    const uniqueDates = [...new Set(dates)];

    let aired = 0;
    let missed = 0;
    let total = 0;

    for (const dateStr of uniqueDates) {
      if (!dateStr) continue;
      const dayStart = new Date(dateStr);
      const dayEnd = new Date(dateStr);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const placements = await this.placementRepo.findMany({
        filters: { dateFrom: dayStart, dateTo: dayEnd } as any,
        take: 10000,
      });

      for (const placement of placements) {
        if (placement.status !== AdvertPlacementStatus.Scheduled) continue;
        total++;

        if (placement.id && matchedPlacementIds.has(placement.id)) {
          const updated = new AdvertPlacementEntity(
            placement.advertSalesId,
            placement.showId,
            placement.date,
            placement.dateEth,
            placement.position,
            placement.durationSeconds,
            AdvertPlacementStatus.Aired,
            placement.broadcastSlotId,
            placement.spotIndex,
            placement.broadcastCode,
            placement.plannedTimeMinutes,
            placement.actualAirTime,
            placement.airAlertSentAt,
            placement.createdAt,
            placement.updatedAt,
            placement.id,
          );
          await this.placementRepo.update(updated);
          aired++;
        } else {
          const updated = new AdvertPlacementEntity(
            placement.advertSalesId,
            placement.showId,
            placement.date,
            placement.dateEth,
            placement.position,
            placement.durationSeconds,
            AdvertPlacementStatus.Missed,
            placement.broadcastSlotId,
            placement.spotIndex,
            placement.broadcastCode,
            placement.plannedTimeMinutes,
            placement.actualAirTime,
            placement.airAlertSentAt,
            placement.createdAt,
            placement.updatedAt,
            placement.id,
          );
          await this.placementRepo.update(updated);
          missed++;
        }
      }
    }

    return { aired, missed, total };
  }
}

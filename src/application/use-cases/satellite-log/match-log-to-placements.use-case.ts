import { SatelliteLogEntryEntity, SatelliteLogMatchType } from '../../../domain/entities/satellite-log-entry.entity';
import { ISatelliteLogEntryRepository } from '../../../domain/repositories/satellite-log-entry.repository.interface';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';
import { ISatelliteLogUploadRepository } from '../../../domain/repositories/satellite-log-upload.repository.interface';

export class MatchLogToPlacementsUseCase {
  constructor(
    private readonly uploadRepo: ISatelliteLogUploadRepository,
    private readonly entryRepo: ISatelliteLogEntryRepository,
    private readonly placementRepo: IAdvertPlacementRepository,
  ) {}

  async execute(uploadId: string): Promise<{ matched: number; unmatched: number }> {
    const upload = await this.uploadRepo.findById(uploadId);
    if (!upload) {
      throw new EntityNotFoundError('Satellite log upload not found', 'SatelliteLogUpload', uploadId);
    }

    const entries = await this.entryRepo.findByUploadId(uploadId);
    const placements = await this.placementRepo.findMany({
      take: 10000,
    });

    const placementsByCode = new Map<string, typeof placements>();
    for (const p of placements) {
      if (p.broadcastCode) {
        const key = p.broadcastCode.toUpperCase();
        if (!placementsByCode.has(key)) {
          placementsByCode.set(key, []);
        }
        placementsByCode.get(key)!.push(p);
      }
    }

    let matched = 0;
    let unmatched = 0;

    for (const entry of entries) {
      if (entry.matchType !== SatelliteLogMatchType.Unmatched) {
        continue;
      }

      let found = false;
      for (const [code, candidates] of placementsByCode) {
        if (entry.description.toUpperCase().includes(code)) {
          const best = candidates.find(
            (c) =>
              c.date.toISOString().split('T')[0] ===
              entry.broadcastDateTime.toISOString().split('T')[0],
          );
          if (best && best.id) {
            entry.matchedPlacementId = best.id;
            entry.matchType = SatelliteLogMatchType.Auto;
            await this.entryRepo.update(entry);
            matched++;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        unmatched++;
      }
    }

    return { matched, unmatched };
  }
}

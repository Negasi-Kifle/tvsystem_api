import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { AdvertPlacementStatus } from '../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../domain/enums/advert-position.enum';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';

export type UpdateAdvertPlacementInput = {
  broadcastSlotId?: string | null;
  position?: AdvertPosition;
  spotIndex?: number;
  broadcastCode?: string | null;
  plannedTimeMinutes?: number | null;
  actualAirTime?: Date | null;
  durationSeconds?: number;
  status?: AdvertPlacementStatus;
};

export class UpdateAdvertPlacementUseCase {
  constructor(private readonly placementRepo: IAdvertPlacementRepository) {}

  async execute(id: string, patch: UpdateAdvertPlacementInput): Promise<AdvertPlacementEntity | null> {
    const existing = await this.placementRepo.findById(id);
    if (!existing || !existing.id) {
      throw new EntityNotFoundError('Advert placement not found', 'AdvertPlacement', id);
    }

    const updated = new AdvertPlacementEntity(
      existing.advertSalesId,
      existing.showId,
      existing.date,
      existing.dateEth,
      patch.position ?? existing.position,
      patch.durationSeconds !== undefined ? patch.durationSeconds : existing.durationSeconds,
      patch.status ?? existing.status,
      patch.broadcastSlotId !== undefined ? patch.broadcastSlotId : existing.broadcastSlotId,
      patch.spotIndex !== undefined ? patch.spotIndex : existing.spotIndex,
      patch.broadcastCode !== undefined ? patch.broadcastCode : existing.broadcastCode,
      patch.plannedTimeMinutes !== undefined ? patch.plannedTimeMinutes : existing.plannedTimeMinutes,
      patch.actualAirTime !== undefined ? patch.actualAirTime : existing.actualAirTime,
      existing.createdAt,
      existing.updatedAt,
      existing.id,
    );

    return this.placementRepo.update(updated);
  }
}

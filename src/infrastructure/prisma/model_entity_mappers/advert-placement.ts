import { Prisma } from '../generated/client';
import { AdvertPlacementEntity } from '../../../domain/entities/advert-placement.entity';
import { AdvertPlacementStatus } from '../../../domain/enums/advert-placement-status.enum';
import { AdvertPosition } from '../../../domain/enums/advert-position.enum';

export const advertPlacementReadInclude = {
  advertSales: true,
  show: true,
  broadcastSlot: true,
} as const;

type AdvertPlacementModel = Prisma.AdvertPlacementGetPayload<Record<string, never>>;

export function modelToEntity(model: AdvertPlacementModel): AdvertPlacementEntity {
  return AdvertPlacementEntity.createInstance(
    model.advertSalesId,
    model.showId,
    model.date,
    model.dateEth,
    model.position as AdvertPosition,
    model.durationSeconds,
    model.status as AdvertPlacementStatus,
    model.broadcastSlotId,
    model.spotIndex,
    model.broadcastCode,
    model.plannedTimeMinutes,
    model.actualAirTime,
    model.airAlertSentAt ?? null,
    model.createdAt,
    model.updatedAt,
    model.id,
  );
}

export function entityToModel(
  entity: AdvertPlacementEntity,
): Prisma.AdvertPlacementUncheckedCreateInput {
  return {
    id: entity.id,
    advertSalesId: entity.advertSalesId,
    showId: entity.showId,
    broadcastSlotId: entity.broadcastSlotId ?? null,
    date: entity.date,
    dateEth: entity.dateEth,
    position: entity.position,
    spotIndex: entity.spotIndex,
    broadcastCode: entity.broadcastCode ?? null,
    plannedTimeMinutes: entity.plannedTimeMinutes ?? null,
    actualAirTime: entity.actualAirTime ?? null,
    durationSeconds: entity.durationSeconds,
    status: entity.status,
    airAlertSentAt: entity.airAlertSentAt ?? null,
  };
}

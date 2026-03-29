import { Prisma, Advert } from '../generated/client';
import { AdvertEntity, AdvertSlotWindow } from '../../../domain/entities/advert.entity.js';
import { AdvertStatus } from '../../../domain/enums/advert-status.enum.js';

function parseSlot(raw: unknown): AdvertSlotWindow | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const start = o.start;
  const end = o.end;
  if (typeof start === 'string' && typeof end === 'string') {
    return { start: new Date(start), end: new Date(end) };
  }
  return null;
}

export function modelToEntity(model: Advert): AdvertEntity {
  return AdvertEntity.createInstance(
    model.showId,
    model.customerId,
    model.status as AdvertStatus,
    parseSlot(model.slot),
    model.contractDetails ?? null,
    model.broadcastSlotId ?? null,
    model.createdAt,
    model.updatedAt,
    model.id,
  );
}

export function entityToModel(entity: AdvertEntity): Prisma.AdvertUncheckedCreateInput {
  return {
    id: entity.id,
    showId: entity.showId,
    customerId: entity.customerId,
    broadcastSlotId: entity.broadcastSlotId ?? null,
    status: entity.status,
    slot:
      entity.slot && entity.slot.start && entity.slot.end
        ? ({
            start: entity.slot.start.toISOString(),
            end: entity.slot.end.toISOString(),
          } as Prisma.InputJsonValue)
        : undefined,
    contractDetails: entity.contractDetails ?? null,
  };
}

import { CommunicationLog } from '../generated/client';
import { CommunicationLogEntity } from '../../../domain/entities/communication-log.entity.js';

export function modelToEntity(model: CommunicationLog): CommunicationLogEntity {
  return CommunicationLogEntity.createInstance(
    model.customerId,
    model.logDate,
    model.salesAgentId,
    model.notes,
    model.mediaPackId ?? undefined,
    model.createdAt,
    model.id,
  );
}

export function entityToModel(entity: CommunicationLogEntity) {
  return {
    id: entity.id ?? '',
    customerId: entity.customerId,
    logDate: entity.logDate,
    salesAgentId: entity.salesAgentId,
    notes: entity.notes,
    mediaPackId: entity.mediaPackId ?? null,
    createdAt: entity.createdAt ?? new Date(),
  };
}

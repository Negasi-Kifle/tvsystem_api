import { CommunicationLog, MediaPack } from '../generated/client';
import { CommunicationLogEntity } from '../../../domain/entities/communication-log.entity.js';
import { MediaPackSummary } from '../../../domain/interfaces/media-pack-summary.interface';

export type CommunicationLogWithRelations = CommunicationLog & {
  salesAgent?: unknown;
  mediaPack?: MediaPack | null;
};

function mediaPackToSummary(mediaPack: MediaPack): MediaPackSummary {
  return {
    id: mediaPack.id,
    version: mediaPack.version,
    versionSlug: mediaPack.versionSlug,
  };
}

export function modelToEntity(model: CommunicationLogWithRelations): CommunicationLogEntity {
  return CommunicationLogEntity.createInstance(
    model.customerId,
    model.logDate,
    model.salesAgentId,
    model.notes,
    model.mediaPackId ?? undefined,
    model.createdAt,
    model.id,
    model.mediaPack ? mediaPackToSummary(model.mediaPack) : undefined,
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

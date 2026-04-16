import { AuditLogEntity } from '../../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';

export type RecordAuditLogInput = {
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
};

export class RecordAuditLogUseCase {
  constructor(private readonly auditLogRepo: IAuditLogRepository) {}

  async execute(input: RecordAuditLogInput): Promise<void> {
    const entity = new AuditLogEntity(
      input.action,
      input.resourceType,
      input.userId,
      input.resourceId,
      input.metadata,
      input.ipAddress,
    );
    await this.auditLogRepo.create(entity);
  }
}

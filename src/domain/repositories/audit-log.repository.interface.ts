import { AuditLogEntity } from '../entities/audit-log.entity';

export interface IAuditLogRepository {
  create(data: Omit<AuditLogEntity, 'id' | 'createdAt'>): Promise<AuditLogEntity>;
}

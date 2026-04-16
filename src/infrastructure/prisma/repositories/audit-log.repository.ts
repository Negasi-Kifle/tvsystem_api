import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { AuditLogEntity } from '../../../domain/entities/audit-log.entity';
import { PrismaBaseRepository } from './base.repository';
import { Prisma } from '../generated/client';

export class AuditLogRepository extends PrismaBaseRepository implements IAuditLogRepository {
  async create(data: Omit<AuditLogEntity, 'id' | 'createdAt'>): Promise<AuditLogEntity> {
    const row = await this.prisma.auditLog.create({
      data: {
        userId: data.userId ?? null,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId ?? null,
        metadata: (data.metadata as Prisma.InputJsonValue) ?? undefined,
        ipAddress: data.ipAddress ?? null,
      },
    });
    return new AuditLogEntity(
      row.action,
      row.resourceType,
      row.userId,
      row.resourceId,
      row.metadata as Record<string, unknown> | null,
      row.ipAddress,
      row.createdAt,
      row.id,
    );
  }
}

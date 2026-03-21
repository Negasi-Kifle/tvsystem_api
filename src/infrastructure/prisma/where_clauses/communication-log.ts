import { Prisma } from '../generated/client';
import { CommunicationLogEntity } from '../../../domain/entities/communication-log.entity';

export function buildWhereClauseForCommunicationLog(
  filters: Partial<CommunicationLogEntity>
): Prisma.CommunicationLogWhereInput {
  if (!filters) return {};
  return {
    ...(filters.customerId !== undefined && { customerId: filters.customerId }),
    ...(filters.salesAgentId !== undefined && { salesAgentId: filters.salesAgentId }),
    ...(filters.logDate !== undefined && { logDate: filters.logDate }),
    ...(filters.mediaPackId !== undefined && { mediaPackId: filters.mediaPackId }),
  };
}

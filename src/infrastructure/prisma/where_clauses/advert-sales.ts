import { AdvertSalesEntity } from '../../../domain/entities/adver-sales.entity';
import { Prisma } from '../generated/client';

export function buildWhereClauseForAdvertSales(
  filters: Partial<AdvertSalesEntity>,
): Prisma.AdvertSalesWhereInput {
  if (!filters) return {};

  return {
    ...(filters.id !== undefined && (Array.isArray(filters.id) ? { id: { in: filters.id } } : { id: filters.id })),
    ...(filters.adPackageId && { advertPackageId: filters.adPackageId }),
    ...(filters.customerId && { customerId: filters.customerId }),
    ...(filters.status && { status: filters.status }),
    ...(filters.advertType && { advertType: filters.advertType }),
    ...(filters.referenceNumber && { referenceNumber: filters.referenceNumber }),
    ...(filters.salesAgentId && { salesAgentId: filters.salesAgentId }),
    ...(filters.industry && { industry: { contains: filters.industry, mode: 'insensitive' as const } }),
  };
}

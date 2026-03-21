import { Prisma } from '../generated/client';
import { CustomerEntity } from '../../../domain/entities/customer.entity';

export function buildWhereClauseForCustomer(filters: Partial<CustomerEntity>): Prisma.CustomerWhereInput {
  if (!filters) return {};
  return {
    ...(filters.businessRef !== undefined && { businessRef: filters.businessRef }),
    ...(filters.name !== undefined && { name: { contains: filters.name, mode: 'insensitive' } }),
    ...(filters.categoryId !== undefined && { categoryId: filters.categoryId }),
    ...(filters.subCategoryId !== undefined && { subCategoryId: filters.subCategoryId }),
    ...(filters.salesAgentId !== undefined && { salesAgentId: filters.salesAgentId }),
    ...(filters.status !== undefined && { status: filters.status }),
    ...(filters.sourceFromMediaMonitoring !== undefined && {
      sourceFromMediaMonitoring: filters.sourceFromMediaMonitoring,
    }),
  };
}

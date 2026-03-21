import { Prisma } from '../generated/client';
import { CustomerShowSuitabilityEntity } from '../../../domain/entities/customer-show-suitability.entity';

export function buildWhereClauseForCustomerShowSuitability(
  filters: Partial<CustomerShowSuitabilityEntity>
): Prisma.CustomerShowSuitabilityWhereInput {
  if (!filters) return {};
  return {
    ...(filters.customerId !== undefined && { customerId: filters.customerId }),
    ...(filters.showSegmentSlotId !== undefined && { showSegmentSlotId: filters.showSegmentSlotId }),
  };
}

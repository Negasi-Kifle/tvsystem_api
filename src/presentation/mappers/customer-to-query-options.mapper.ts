import { CustomerEntity } from '../../domain/entities/customer.entity';
import { CustomerStatusWithUs } from '../../domain/enums/customer-status.enum';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllCustomersDto } from '../dtos/requests/customer/fetch-all-customers.dto';

export function mapFetchAllCustomersDtoToQueryOptions(dto: FetchAllCustomersDto): QueryOptions<CustomerEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.businessRef != null && { businessRef: dto.businessRef }),
      ...(dto.name != null && { name: dto.name }),
      ...(dto.categoryId != null && { categoryId: dto.categoryId }),
      ...(dto.subCategoryId != null && { subCategoryId: dto.subCategoryId }),
      ...(dto.salesAgentId != null && { salesAgentId: dto.salesAgentId }),
      ...(dto.status != null && { status: dto.status as CustomerStatusWithUs }),
      ...(dto.sourceFromMediaMonitoring != null && {
        sourceFromMediaMonitoring: dto.sourceFromMediaMonitoring,
      }),
    },
  };
}

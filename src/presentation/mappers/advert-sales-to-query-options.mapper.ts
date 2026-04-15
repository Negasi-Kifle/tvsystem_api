import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllAdvertSalesDto } from '../dtos/requests/advert-sales/fetch-all.dto';

export function mapFetchAllAdvertSalesDtoToQueryOptions(
  dto: FetchAllAdvertSalesDto,
): QueryOptions<AdvertSalesEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.adPackageId != null && { adPackageId: dto.adPackageId }),
      ...(dto.customerId != null && { customerId: dto.customerId }),
      ...(dto.status != null && { status: dto.status as AdvertSalesStatus }),
      ...(dto.advertType != null && { advertType: dto.advertType as AdvertType }),
      ...(dto.referenceNumber != null && { referenceNumber: dto.referenceNumber }),
      ...(dto.salesAgentId != null && { salesAgentId: dto.salesAgentId }),
    },
  };
}

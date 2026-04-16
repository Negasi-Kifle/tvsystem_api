import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllPaymentsDto } from '../dtos/requests/payment/fetch-all-payments.dto';

export function mapFetchAllPaymentsDtoToQueryOptions(dto: FetchAllPaymentsDto): QueryOptions<PaymentEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.advertSalesId != null && { advertSalesId: dto.advertSalesId }),
      ...(dto.status != null && { status: dto.status as PaymentStatus }),
    },
  };
}

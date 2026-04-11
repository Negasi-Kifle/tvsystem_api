import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { mapFetchAllAdvertSalesDtoToQueryOptions } from '../../presentation/mappers/advert-sales-to-query-options.mapper';

describe('mapFetchAllAdvertSalesDtoToQueryOptions', () => {
  it('maps page and limit to skip and take', () => {
    const q = mapFetchAllAdvertSalesDtoToQueryOptions({
      page: 3,
      limit: 10,
      adPackageId: undefined,
      customerId: undefined,
      status: undefined,
      advertType: undefined,
      referenceNumber: undefined,
      salesAgentId: undefined,
    });
    expect(q.skip).toBe(20);
    expect(q.take).toBe(10);
    expect(q.filters).toEqual({});
  });

  it('includes optional filters when set', () => {
    const adPackageId = '11111111-1111-4111-8111-111111111111';
    const customerId = '22222222-2222-4222-8222-222222222222';
    const salesAgentId = '33333333-3333-4333-8333-333333333333';
    const q = mapFetchAllAdvertSalesDtoToQueryOptions({
      page: 1,
      limit: 10,
      adPackageId,
      customerId,
      status: AdvertSalesStatus.Signed,
      advertType: AdvertType.Paid,
      referenceNumber: 'REF123',
      salesAgentId,
    });
    expect(q.filters).toEqual({
      adPackageId,
      customerId,
      status: AdvertSalesStatus.Signed,
      advertType: AdvertType.Paid,
      referenceNumber: 'REF123',
      salesAgentId,
    });
  });
});

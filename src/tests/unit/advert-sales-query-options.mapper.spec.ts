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
      salesRepId: undefined,
      salesAgentId: undefined,
      categoryId: undefined,
      subCategoryId: undefined,
      installmentCount: undefined,
    });
    expect(q.skip).toBe(20);
    expect(q.take).toBe(10);
    expect(q.filters).toEqual({});
  });

  it('includes optional filters when set', () => {
    const adPackageId = '11111111-1111-4111-8111-111111111111';
    const customerId = '22222222-2222-4222-8222-222222222222';
    const salesRepId = '33333333-3333-4333-8333-333333333333';
    const salesAgentId = '44444444-4444-4444-8444-444444444444';
    const categoryId = '55555555-5555-4555-8555-555555555555';
    const subCategoryId = '66666666-6666-4666-8666-666666666666';
    const installmentCount = 3;
    const q = mapFetchAllAdvertSalesDtoToQueryOptions({
      page: 1,
      limit: 10,
      adPackageId,
      customerId,
      status: AdvertSalesStatus.Signed,
      advertType: AdvertType.Paid,
      referenceNumber: 'REF123',
      salesRepId,
      salesAgentId,
      categoryId,
      subCategoryId,
      installmentCount,
    });
    expect(q.filters).toEqual({
      adPackageId,
      customerId,
      status: AdvertSalesStatus.Signed,
      advertType: AdvertType.Paid,
      referenceNumber: 'REF123',
      salesRepId,
      salesAgentId,
      categoryId,
      subCategoryId,
      installmentCount,
    });
  });
});

import { mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions } from '../../presentation/mappers/advert-package-media-pack-to-query-options.mapper';

describe('mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions', () => {
  it('maps page and limit to skip and take', () => {
    const q = mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions({
      page: 3,
      limit: 10,
      advertPackageId: undefined,
      mediaPackId: undefined,
    });
    expect(q.skip).toBe(20);
    expect(q.take).toBe(10);
    expect(q.filters).toEqual({});
  });

  it('includes optional filters when set', () => {
    const advertPackageId = '11111111-1111-4111-8111-111111111111';
    const mediaPackId = '22222222-2222-4222-8222-222222222222';
    const q = mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions({
      page: 1,
      limit: 10,
      advertPackageId,
      mediaPackId,
    });
    expect(q.filters).toEqual({ advertPackageId, mediaPackId });
  });
});
